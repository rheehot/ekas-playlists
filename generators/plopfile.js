/**
 * Plopfile generator
 *
 * https://github.com/amwmedia/plop
 */

module.exports = plop => {
	plop.load('./track-generator.js')
	plop.load('./album-generator.js')
	plop.load('./mix-generator.js')
}
