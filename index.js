'use strict'

const {default: PQueue} = require('p-queue')
const debug = require('debug')('hafas-find-stations')
const findNearbyResultsLimit = require('./lib/find-nearby-results-limit')
const computePoints = require('./lib/compute-points')
const subquery = require('./lib/subquery')

const noop = () => {}

const center = bbox => ({
	type: 'location',
	latitude: +(bbox.south + (bbox.north - bbox.south) / 2).toFixed(5),
	longitude: +(bbox.west + (bbox.east - bbox.west) / 2).toFixed(5)
})

const isWithin = (bbox, loc) => {
	const {latitude: lat, longitude: lon} = loc
	const {north, west, south, east} = bbox
	return lat <= north && lon >= west && lat >= south && lon <= east
}

const defaults = {
	maxTileSize: 5, // in kilometers
	concurrency: 8 // nr or requests in parallel
}

// todo: find a more elegant API than async fn + cb(err, stationOrEnd)
const findStations = async (hafas, bbox, opt = {}, cb = noop) => {
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
	const {distance, points} = computePoints(bbox, {maxTileSize})
	const resultsLimit = await findNearbyResultsLimit(hafas, center(bbox))
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
			if (!isWithin(bbox, station.location)) return;
			if (station.id in stationsById) return;
			stationsById[station.id] = station
			nrOfNew++
			cb(null, station)
		}
		for (const stop of stops) {
			maybeAdd(stop)
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
	await queue.addAll(points.map(add))
	cb(null, null)

	return Object.values(stationsById)
}

module.exports = findStations
