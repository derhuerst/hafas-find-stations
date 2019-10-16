'use strict'

const distance = require('@turf/distance').default
const pointGrid = require('@turf/point-grid').default

const MAX_POINT_DISTANCE = 5 // in kilometers

const roundTo = (v, d) => +v.toFixed(d)

const computePoints = (bbox) => {
	if ('number' !== typeof bbox.north) throw new TypeError('bbox.north must be a number.')
	if ('number' !== typeof bbox.west) throw new TypeError('bbox.west must be a number.')
	if ('number' !== typeof bbox.south) throw new TypeError('bbox.south must be a number.')
	if ('number' !== typeof bbox.east) throw new TypeError('bbox.east must be a number.')
	if (bbox.north <= bbox.south) throw new Error('bbox.north must be larger than bbox.south.')
	if (bbox.east <= bbox.west) throw new Error('bbox.east must be larger than bbox.west.')

	const pointDistance = Math.min(
		distance([bbox.west, bbox.south], [bbox.east, bbox.south]), // southern edge
		distance([bbox.east, bbox.south], [bbox.east, bbox.north]), // eastern edge
		MAX_POINT_DISTANCE
	)

	// Last time I checked on 2019-10-15 @turf/point-grid generated a
	// a grid with square sides equal by *degrees*, not by *meters*
	// over ground. We want the latter though.
	// In the southern hemisphere, this will generate points in a
	// distance larger than MAX_POINT_DISTANCE, so we won't cover
	// the area when querying by radius around the points.
	// This problem is amplified by a large bounding box.
	// https://github.com/Turfjs/turf/blob/b6cb691e0d23293ca0c881fe561f0e8a4536ad6a/packages/turf-rectangle-grid/index.ts#L46-L49
	// todo: use a lib for grids with consistent meters over ground
	const grid = pointGrid([
		bbox.west, bbox.south, bbox.east, bbox.north
	], pointDistance)
	const points = grid.features.map(f => ({
		type: 'location',
		latitude: +f.geometry.coordinates[1].toFixed(8),
		longitude: +f.geometry.coordinates[0].toFixed(8)
	}))

	return {
		points,
		distance: pointDistance * 1000
	}
}

module.exports = computePoints
