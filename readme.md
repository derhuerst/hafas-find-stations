# hafas-find-stations

**Given a [HAFAS client](https://github.com/public-transport/hafas-client), find all stations in a bounding box.**

[![npm version](https://img.shields.io/npm/v/hafas-find-stations.svg)](https://www.npmjs.com/package/hafas-find-stations)
[![build status](https://api.travis-ci.org/derhuerst/hafas-find-stations.svg?branch=master)](https://travis-ci.org/derhuerst/hafas-find-stations)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/hafas-find-stations.svg)
![minimum Node.js version](https://img.shields.io/node/v/hafas-find-stations.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installation

```shell
npm install hafas-find-stations
```


## Usage

```js
const createHafas = require('hafas-client')
const vbbProfile = require('hafas-client/p/vbb')
const findStations = require('hafas-find-stations')

const bbox = {
	north: 52.53,
	west: 13.36,
	south: 52.51,
	east: 13.41
}

const hafas = createHafas(vbbProfile, 'hafas-find-stations example')

findStations(hafas, bbox, {concurrency: 1}, (err, station) => {
	if (err) console.error(err)
	if (station) console.log(station.id + '\t' + station.name)
})
.catch(console.error)
```


## Contributing

If you have a question or need support using `hafas-find-stations`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/hafas-find-stations/issues).
