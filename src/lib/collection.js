import { pipe, map } from 'lodash/fp'
import { Collections } from 'postman-sdk'

/**
 * Saves a collection to Postman
 *
 * @param {Object} collection The collection object
 * @returns {Promise<Object|Boolean>} The newly created collection or false
 */
const save = config => async collection => {
	try {

        pipe([
            exists(collection)
		])

		const exists = await exists(collection.collection.info.name)
		console.info('COLLECTION EXISTS?', exists)
		let results
		if (!exists) {
			results = await Collections.post(collection)
		} else {
			collection.collection.info._postman_id = exists.id
			results = await Collections.put(exists.id, collection)
		}

		if (results.error) {
			console.error(
				`Could not save collection to Postman: ${
					results.error.message
				}`,
				results
			)

			return false
		}

		collection.info._postman_id = results.collection.id

		console.info(
			`Collection ${results.collection.name} (${
				results.collection.id
			}) Saved To Postman!`
		)

		return results.collection
	} catch (error) {
		console.error(
			`Could not save collection to Postman: ${error.message}`,
			error
		)

		return false
	}
}

/**
 * Checks if a collection exists on postman
 *
 * @param {String} name The collection name
 * @returns {Promise<object|boolean>} The collection object if it exists false otherwise
 */
const exists = collection => async name => {
	try {
		const results = await Collections.get()

		if (results.collections) {
			const filerCollection = results.collections.filter(
				collection => collection.name === name
			)
			return filerCollection.length > 0 ? filerCollection[0] : false
		}

		return false
	} catch (error) {
		console.error(
			`Error while trying to check if the collection "${name}" exists: ${
				error.message
			}`
		)
		return false
	}
}

export default save
