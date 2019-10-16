'use strict'

const debug = require('debug')('hafas-find-stations:find-nearby-results-limit')

const INITIAL_RADIUS = 200 // meters
const MAX_ITERATIONS = 10
const RESULTS = 10000

const findNearbyResultsLimit = async (hafas, loc) => {
	let i = 0, iterationsWithoutIncrease = 0
	let radius = INITIAL_RADIUS, lastNrOfResults = NaN
	while (i++ < MAX_ITERATIONS) {
		const opt = {distance: radius, results: RESULTS}
		debug('calling hafas.nearby', loc, opt)
		const nrOfResults = Math.max((await hafas.nearby(loc, opt)).length, 1)
		debug('nrOfResults', nrOfResults)

		if (nrOfResults === lastNrOfResults) {
			iterationsWithoutIncrease++
			radius *= 3
			if (iterationsWithoutIncrease >= 5) {
				debug('no increase of results in 5 iterations')
				return nrOfResults
			}
		} else {
			iterationsWithoutIncrease = 0
			radius *= 2
		}
		lastNrOfResults = nrOfResults
	}

	debug('max nr of iterations', 'nr of results', lastNrOfResults)
	return lastNrOfResults
}

module.exports = findNearbyResultsLimit
