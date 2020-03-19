'use strict'

const createHafas = require('hafas-client')
const vbbProfile = require('hafas-client/p/vbb')
// const findNearbyResultsLimit = require('./lib/find-nearby-results-limit')
const findStations = require('.')

const hafas = createHafas(vbbProfile, 'hafas-find-stations example')

const centerOfBerlin = {
	type: 'Polygon',
	coordinates: [[
		[13.350, 52.528],
		[13.350, 52.516],
		[13.358, 52.504],
		[13.389, 52.493],
		[13.436, 52.495],
		[13.449, 52.513],
		[13.439, 52.530],
		[13.413, 52.537],
		[13.378, 52.538],
		[13.350, 52.528]
	]]
}
const centerOfBerlin2 = {
	north: 52.53,
	west: 13.36,
	south: 52.51,
	east: 13.41
}

findStations(hafas, centerOfBerlin, (err, station) => {
	if (err) console.error(err)
	if (station) console.log(station.id + '\t' + station.name)
})
.catch((err) => {
	console.error(err)
	process.exit(1)
})
