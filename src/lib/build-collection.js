import map from 'lodash/fp/map'
import pipe from 'lodash/fp/pipe'

/**
 * Router stack filter constructor
 *
 * @param {string} by The key that will be used to filter the routes
 * @param {string} value The value which to compare to
 * @returns {function(route:object)} The filterStack function
 */
const filterStack = (by, value) =>
	/**
	 * Router stack filter
	 *
	 * @param {object} route The route Layer
	 * @returns {Object[]} An array of routes
	 */
	route => route.stack.filter(route => route[by] === value)

/**
 * Checks if the endpoints group folder exists and if not create it
 *
 * @param {Object} collection The collection
 * @returns {Object} The collection
 */
const ensureFolderExists = collection =>
	/**
	 * Checks if the endpoints group folder exists and if not create it
	 *
	 * @param {object} route The route Layer
	 * @returns {*}
	 */
	route => {
		const id = getGroupId(route.regexp.source)
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
const getGroupId = regex => {
	// @todo create better folder labels for first level routes instead of the route path cleaned from the regex
	const matches = regex.match(/\^(.*?)\?/g, '')
	if (matches.length) {
		return matches[0].replace(/[\\^$?]/g, '').slice(0, -1)
	}
	throw new Error(`Could not extract id from ${regex}`)
}

/**
 * Add route items to collection
 *
 * @param {object} collection The collection
 * @returns {*} The collection
 */
const addItems = collection =>
	/**
	 * Adds items to the collection
	 *
	 * @param {object} route The route Layer
	 * @returns {*}
	 */
	route => {
		const groupId = getGroupId(route.regexp.source)
		const stack = route.handle.stack

		if (!stack.length) {
			return collection
		}
		/**
		 * Recursive helper
		 *
		 * @param {number} index The current index
		 * @returns {*} The collection
		 */
		const r = index => {
			// @todo remove this function from here into a separate function
			const route = stack[index]

			if (!route.route) {
				return addItems(collection)(route)
			}

			createItemsFromMethods(collection, groupId, route.route)

			if (++index > stack.length - 1) {
				return collection
			}

			r(index)
		}

		return r(0)
	}

/**
 * Creates items based on the route methods
 *
 * @param {object} collection The collection
 * @param {string} groupId The group to add the new items to
 * @param {object} route A route layer
 * @returns {String[]} The method names that were added to the collection
 */
const createItemsFromMethods = (collection, groupId, route) => {
	return map(method => {
		collection.item.addToFolder(groupId, `${groupId}${route.path}`, method)
	})(Object.keys(route.methods))
}

/**
 * The collection builder
 *
 * @param {object} collection The collection
 * @param {object} router The app router object
 * @param {object} config The config object
 * @returns {Promise<Object>} A pronise that resolves with the built collection
 */
export default async (collection, router, config) => {
	pipe([
		filterStack('name', 'router'),
		routes =>
			map(route =>
				pipe([ensureFolderExists(collection), addItems(collection)])(
					route
				)
			)(routes)
	])(router)

	return collection
}
