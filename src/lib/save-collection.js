import { findBy, pipe } from './../helper/util'
import { Collections } from 'postman-sdk'


/**
 * Gets all postman collections
 *
 * @returns {Promise<*>} Promise that resolves with the collections object
 * @throws Error
 */
const getCollection = async () => {
	try {
		return Collections.get()
	} catch (error) {
		throw new Error(`Unexpected error occurred: ${error.message}`)
	}
}

/**
 * Checks if a collection exists on postman
 *
 * @param {object} collection The current collection
 * @returns {Promise<object|boolean>} The collection object if it exists false otherwise
 */
const collectionExists = collection => collections =>
	findBy(collections.collections, 'name', collection.info.name)

/**
 * Updates a new collection
 *
 * @param {object} collection The collection object
 * @returns {function(*=): *} A function
 */
const updateCollection = collection => async exists =>
	!exists
		? Promise.resolve(exists)
		: await Collections.put(exists.uid, { collection })


/**
 * Create a new collection on postman
 *
 * @param {object} collection The collection object
 * @returns {function(*): *} A function
 */
const createCollection = collection => async exists =>
	exists === null
		? await Collections.post({ collection })
		: Promise.resolve(exists)


/**
 * Checks if the request resulted in an error
 *
 * @param {object} results THe results object
 * @returns {object} The results object
 */
const checkForError = results => {
	if (results.error) {
		throw new Error(
			'Could not save collection to Postman: ' + results.error.message
		)
	}

	return Promise.resolve(results)
}

/**
 * Creates a suvvess response
 *
 * @param {object} results The results object
 * @returns {object} A suvvess response object
 */
const respond = results =>
	Promise.resolve({
		message: 'Collection created!',
		results
	})

/**
 * Saves a collection to Postman
 *
 * @param {Object} collection The collection object
 * @returns {Promise<Object|Boolean>} The newly created collection or false
 */
export default async (collection, environments = null) =>
	await pipe(
		getCollection,
		collectionExists(collection),
		updateCollection(collection),
		createCollection(collection),
		checkForError,
		respond
	)(collection.info.name)
