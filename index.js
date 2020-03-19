'use strict'

const {default: PQueue} = require('p-queue')
const debug = require('debug')('hafas-find-stations')
const {shapeToFeature, center, isWithin} = require('./lib/helpers')
const findNearbyResultsLimit = require('./lib/find-nearby-results-limit')
const computePoints = require('./lib/compute-points')
const subquery = require('./lib/subquery')

const noop = () => {}

const defaults = {
	maxTileSize: 5, // in kilometers
	concurrency: 8 // nr or requests in parallel
}

// todo: find a more elegant API than async fn + cb(err, stationOrEnd)
const findStations = async (hafas, area, opt = {}, cb = noop) => {
	area = shapeToFeature(area)
	if ('function' === typeof opt) {
		cb = opt
		opt = {}
	}
	if ('function' !== typeof cb) throw new Error('cb must be a function')
	const {
		maxTileSize,
		concurrency
	} = {...defaults, ...opt}

	const stationsById = Object.create(null) // by ID
	const {distance, points} = computePoints(area, {maxTileSize})
	const resultsLimit = await findNearbyResultsLimit(hafas, center(area))
	debug('distance', distance)
	debug('points', points)
	debug('resultsLimit', resultsLimit)

	const queue = new PQueue({concurrency})

	const fetchCircle = async (center, radius) => {
		debug(center, 'fetching with radius', radius)
		// todo: fetch by rectangle once hafas-client supports it
		const stops = await hafas.nearby(center, {
			distance: radius + 5, // to be sure
			results: resultsLimit,
			poi: false
		})

		let nrOfNew = 0
		const maybeAdd = (station) => {
			if (!isWithin(area, station.location)) return;
			if (station.id in stationsById) return;
			stationsById[station.id] = station
			nrOfNew++
			setImmediate(cb, null, station)
		}
		for (const stop of stops) {
			maybeAdd(stop)
			if (Array.isArray(stop.stops)) {
				for (const subStop of stop.stops) maybeAdd(subStop)
			}
			if (stop.station) maybeAdd(stop.station)
		}
		debug(center, `found ${nrOfNew} new`)

		if (stops.length >= resultsLimit) {
			debug(center, 'too many, trying with smaller a radius')
			const tasks = subquery(center, radius).map(([center, radius]) => {
				// todo: what to do on error? abort?
				return () => fetchCircle(center, radius).catch(cb)
			})
			queue.addAll(tasks, {priority: 1})
		}
	}

	// todo: what to do on error? abort?
	const add = point => () => fetchCircle(point, distance / Math.SQRT2).catch(cb)
	queue.addAll(points.map(add))
	await queue.onIdle()
	setImmediate(cb, null, null)

	return Object.values(stationsById)
}

module.exports = findStations
