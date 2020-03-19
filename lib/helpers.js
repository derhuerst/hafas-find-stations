'use strict'

const centerOfMass = require('@turf/center-of-mass').default
const isPointInPolygon = require('@turf/boolean-point-in-polygon').default

const shapeToFeature = (shape) => {
	if (shape.type === 'Feature') return shape
	if (shape.type === 'Polygon') { // GeoJSON geometry
		return {type: 'Feature', properties: {}, geometry: shape}
	}
	if ( // hafas-client bbox format
		'number' === typeof shape.north &&
		'number' === typeof shape.west &&
		'number' === typeof shape.south &&
		'number' === typeof shape.east
	) return {
		type: 'Feature',
		geometry: {
			type: 'Polygon',
			coordinates: [[
				[shape.west, shape.north],
				[shape.west, shape.south],
				[shape.east, shape.south],
				[shape.east, shape.north],
				[shape.west, shape.north]
			]]
		}
	}
	throw new Error('invalid shape')
}

const center = (polygon) => {
	const center = centerOfMass(polygon)
	return {
		type: 'location',
		latitude: center.geometry.coordinates[1],
		longitude: center.geometry.coordinates[0]
	}
}

const isWithin = (polygon, loc) => {
	return isPointInPolygon([loc.longitude, loc.latitude], polygon)
}

module.exports = {
	shapeToFeature,
	center,
	isWithin,
}
