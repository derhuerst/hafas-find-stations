'use strict'

const {default: PQueue} = require('p-queue')
const debug = require('debug')('hafas-find-stations')
const findNearbyResultsLimit = require('./lib/find-nearby-results-limit')
const computePoints = require('./lib/compute-points')

const noop = () => {}

const center = bbox => ({
	type: 'location',
	latitude: +(bbox.south + (bbox.north - bbox.south) / 2).toFixed(5),
	longitude: +(bbox.west + (bbox.east - bbox.west) / 2).toFixed(5)
})

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

	// todo

	return Object.values(stationsById)
}

module.exports = findStations
