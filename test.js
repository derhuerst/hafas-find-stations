'use strict'

const createHafas = require('hafas-client')
const vbbProfile = require('hafas-client/p/vbb')
const {ifError, ok, deepStrictEqual} = require('assert')
const findStations = require('.')

const hafas = createHafas(vbbProfile, 'hafas-find-stations example')

const bbox = {
	north: 52.528,
	west: 13.38,
	south: 52.5,
	east: 13.43
}

const expected = [
	'900000012151', // Willy-Brandt-Haus
	'900000012161', // Wilhelmstr./Franz-Klühs-Str.
	'900000012101', // S Anhalter Bahnhof
	'900000012153', // Wilhelmstr./Kochstr.
	'900000012158', // Franz-Klühs-Str.
	'900000012102', // U Kochstr./Checkpoint Charlie
	'900000012157', // Jüdisches Museum
	'900000012154', // Charlottenstr.
	'900000100535', // Leipziger Str./Wilhelmstr.
	'900000100018', // U Stadtmitte [5]
	'900000100528', // U Stadtmitte [3-4]
	'900000100010', // U Mohrenstr.
	'900000012104', // Lindenstr./Oranienstr.
	'900000100011', // U Stadtmitte
	'900000012155', // Waldeckpark
	'900000100527', // Jerusalemer Str.
	'900000100543', // Behrenstr./Wilhelmstr.
	'900000012156', // Alexandrinenstr.
	'900000100027', // U Französische Str.
	'900000100012', // U Hausvogteiplatz
	'900000100025', // S+U Brandenburger Tor
	'900000013104', // Prinzenstr./Ritterstr.
	'900000100037', // S+U Brandenburger Tor/Glinkastr.
	'900000100013', // U Spittelmarkt
	'900000100513', // Unter den Linden/Friedrichstr.
	'900000100530', // Werderscher Markt
	'900000013101', // U Moritzplatz
	'900000100514', // Staatsoper
	'900000013151', // Segitzdamm
	'900000100508', // Philippstr.
	'900000100506', // Torstr./U Oranienburger Tor
	'900000100819', // U Oranienburger Tor [Linienstr.]
	'900000100019', // U Oranienburger Tor
	'900000100719', // U Oranienburger Tor [Tram/Bus]
	'900000100509', // Deutsches Theater
	'900000100047', // Friedrichstr./Reinhardtstr.
	'900000100007', // S Oranienburger Str.
	'900000100520', // Marschallbrücke
	'900000100001', // S+U Friedrichstr.
	'900000100541', // Georgenstr./Am Kupfergraben
	'900000100540', // Universitätsstr.
	'900000100512', // Monbijouplatz
	'900000100038', // Am Kupfergraben
	'900000100080', // U Weinmeisterstr./Gipsstr.
	'900000100002', // S Hackescher Markt
	'900000100051', // U Weinmeisterstr.
	'900000100537', // Lustgarten
	'900000100515', // Spandauer Str./Marienkirche
	'900000100045', // Berliner Rathaus
	'900000100031', // S+U Alexanderplatz/Memhardstr.
	'900000100030', // Memhardstr.
	'900000100731', // S+U Alexanderpl/Memhardstr.[4-5]
	'900000100531', // Neumannsgasse
	'900000100024', // S+U Alexanderplatz/Dircksenstr.
	'900000100003', // S+U Alexanderplatz
	'900000100026', // S+U Alexanderplatz/Gontardstr.
	'900000100705', // S+U Alexanderplatz [U8]
	'900000100559', // Jüdenstr.
	'900000014105', // Waldemarstr./Manteuffelstr.
	'900000014152', // Mariannenplatz
	'900000014156', // Heinrichplatz
	'900000014151', // Waldemarstr./Adalbertstr.
	'900000014103', // Adalbertstr./Oranienstr.
	'900000100546', // Adalbertstr.
	'900000014107', // Bethaniendamm
	'900000013152', // Oranienplatz
	'900000100523', // Köpenicker Str./Adalbertstr.
	'900000100544', // Heinrich-Heine-Platz
	'900000100521', // Michaelkirchstr.
	'900000100032', // Heinrich-Heine-Str./Annenstr.
	'900000100008', // U Heinrich-Heine-Str.
	'900000100519', // Lichtenberger Str.
	'900000100516', // U Märkisches Museum/Inselstr.
	'900000100004', // S+U Jannowitzbrücke
	'900000100014', // U Märkisches Museum
	'900000100518', // Alexanderstr.
	'900000100726', // Fischerinsel.
	'900000100526', // Fischerinsel
	'900000100015', // U Klosterstr.
	'900000120510', // Weinstr.
	'900000120511', // Büschingstr.
	'900000100040', // Mollstr./Otto-Braun-Str.
	'900000110022', // Mollstr./Prenzlauer Allee
	'900000100017', // U Schillingstr.
	'900000100707', // U Alexanderplatz [Bus]
	'900000100005', // U Alexanderplatz [Tram]
	'900000100703', // S+U Alexanderplatz [U2]
	'900000100712', // S+U Alexanderpl./Grunerstr [Alexanderstr.]
	'900000100711', // S+U Alexanderpl./Grunerstr [Grunerstr.]
	'900000100704', // S+U Alexanderplatz [U5]
	'900000100560', // Littenstr.
]

process.exitCode = 1
const collected = []

findStations(hafas, bbox, {concurrency: 1}, (err, station) => {
	ifError(err)

	if (station === null) {
		deepStrictEqual(collected.sort(), expected.sort())

		console.info('collected stations look good ✔︎')
		process.exit(0)
	}

	console.info(station.id, station.name)
	collected.push(station.id)
})
.catch(ifError)
