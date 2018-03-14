import { findBy, pipe } from './../helper/util'
import { Collections } from 'postman-sdk'

/**
 * Create a new collection on postman
 *
 * @param {object} collection The collection object
 * @returns {function(*): *} A function
 */
const createCollection = collection => async exists =>
	Collections.post({ collection })

/**
 * Updates a new collection
 *
 * @param {object} collection The collection object
 * @returns {function(*=): *} A function
 */
const updateCollection = collection => async exists =>
	!exists
		? Promise.resolve(exists)
		: Collections.put(collection.collection.info._postman_id, collection)

/**
 * Checks if a collection exists on postman
 *
 * @param {object} collection The current collection
 * @returns {Promise<object|boolean>} The collection object if it exists false otherwise
 */
const collectionExists = collection => collections =>
	findBy(collections, 'name', collection.info.name)

/**
 * Checks if the request resulted in an error
 *
 * @param {object} results THe results object
 * @returns {object} The results object
 */
const checkForError = results => {
	console.info('ERROR')
	console.info(results)
	if (results.error) {
		throw new Error(
			`Could not save collection to Postman: ${results.error.message}`
		)
	}

	return results
}

/**
 * Creates a suvvess response
 *
 * @param {object} results The results object
 * @returns {object} A suvvess response object
 */
const finalize = results => ({
	message: 'Collection created!',
	meta: results
})

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
 * Saves a collection to Postman
 *
 * @param {Object} collection The collection object
 * @returns {Promise<Object|Boolean>} The newly created collection or false
 */
export default async collection => {
	console.info('HELLO')
	console.info(collection)

	return pipe(
		name => {
			console.info('PIPING', name)
			return Promise.resolve(name)
		},
		getCollection,
		collections => {
			console.info('COLLECTIONS')
			console.info(collections)
			return Promise.resolve(collections.collections)
		},
		collectionExists(collection),
		exists => {
			console.info('EXISTS')
			console.info(exists)
			return Promise.resolve(exists)
		},
		updateCollection(collection),
		exists => {
			console.info('UPDATE')
			console.info(exists)
			console.info(collection)
			return Promise.resolve(exists)
		},
		createCollection(collection),
		results => {
			console.info('CREATED')
			console.info(results)
			return Promise.resolve(results)
		},
		checkForError,
		finalize
	)(collection.info.name)
}
