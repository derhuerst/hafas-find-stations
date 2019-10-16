'use strict'

const destination = require('@turf/destination').default

const subquery = (center, parentRadius) => {
	const origin = [center.longitude, center.latitude]
	const radius = parentRadius / 2
	const dest = (bearing) => {
		const d = destination(origin, radius / 1000, bearing)
		return {
			type: 'location',
			latitude: d.geometry.coordinates[1],
			longitude: d.geometry.coordinates[0]
		}
	}
	return [
		[dest(0 + 45), radius], // north east
		[dest(90 + 45), radius], // south east
		[dest(0 - 45), radius], // north west
		[dest(-90 - 45), radius] // south west
	]
}

module.exports = subquery
