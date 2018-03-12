import { map, pipe } from 'lodash/fp'

const build = async (collection, router, config) =>
	pipe([
		filterStack('name', 'router'), // routes
		routes => {
			return routes
		},
		routes =>
			map(route => {
				return pipe([
					ensureFolderExists(collection),
					addItems(collection)
				])(route)
			})(routes),
		collections => {
			// console.info(collection)
			return collection
		}
		//await saveCollection(config), // payload
		//await saveEnvironment(config), // payload
		//saveCollectionFile(config) // payload
	])(router)

/**
 *
 * @param stack
 * @param by
 * @param value
 */
const filterStack = (by, value) => route =>
	route.stack.filter(route => route[by] === value)

/**
 * Checks if the endpoints group folder exists and if not create it
 *
 * @param {Object} collection The collection
 * @param {Object} route The route
 * @returns {Object} The collection
 */
const ensureFolderExists = collection => route => {
	const id = cleanRegex(route.regexp.source)
	if (!collection.item.has(id)) {
		collection.item.addFolder(id)
	}

	return route
}

/**
 * Cleans a route regexp string to the the groupId
 *
 * @param {String} regex The regex string
 * @returns {string} The sanitized string
 */
const cleanRegex = regex => {
	// @todo create better folder labels for first level routes instead of the route path cleaned from the regex
	const matches = regex.match(/\^(.*?)\?/g, '')
	if (matches.length) {
		return matches[0].replace(/[\\^$?]/g, '')
	}
	throw new Error(`Could not extract id from ${regex}`)
}

/**
 * Add route items to collection
 *
 * @param {object[]} stack The route stack
 * @param {string} groupId The group id for this stack
 * @param {object} collection The collection
 * @returns {*} The collection
 */
const addItems = collection => route => {
	const groupId = cleanRegex(route.regexp.source)
	const stack = route.handle.stack

	if (!stack.length) {
		return collection
	}
	/**
	 * Resursive helper
	 *
	 * @param {number} index The current index
	 * @returns {*} The collection
	 */
	const r = index => {
		const route = stack[index]

		if (!route.route && route.handle && route.handle.stack) {
			return addItems(collection)(route)
		}

		map(method => {
			collection.item.addToFolder(
				groupId,
				`/${groupId}${route.route.path}`,
				method
			)
		})(Object.keys(route.route.methods))

		if (++index > stack.length - 1) {
			return collection
		}

		r(++index)
	}

	return r(0)
}

export default build
