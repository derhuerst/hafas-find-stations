'use strict'

const createHafas = require('hafas-client')
const vbbProfile = require('hafas-client/p/vbb')
// const findNearbyResultsLimit = require('./lib/find-nearby-results-limit')
const findStations = require('.')

const hafas = createHafas(vbbProfile, 'hafas-find-stations example')

// findNearbyResultsLimit(hafas, {
// 	type: 'location',
// 	latitude: 52.99680,
// 	longitude: 11.41925
// })
findStations(hafas, {
	north: 52.53,
	west: 13.36,
	south: 52.51,
	east: 13.41
}, (err, station) => {
	if (err) console.error(err)
	if (station) console.log(station.id + '\t' + station.name)
})
.catch((err) => {
	console.error(err)
	process.exit(1)
})
