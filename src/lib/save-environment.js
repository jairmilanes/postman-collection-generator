import { Environments } from 'postman-sdk'
import { findBy, pipe } from '../helper/util'

/**
 * Gets all postman collections
 *
 * @returns {Promise<*>} Promise that resolves with the collections object
 * @throws Error
 */
const getEnvironments = async () => {
	try {
		return Environments.get()
	} catch (error) {
		throw new Error(`Unexpected error occurred: ${error.message}`)
	}
}

/**
 * Checks if a collection exists on postman
 *
 * @param {object} environment The current environment
 * @returns {Promise<object|boolean>} The collection object if it exists false otherwise
 */
const environmentExists = environment => environments =>
	findBy(environments.environments, 'name', environment.name)

/**
 * Updates a new collection
 *
 * @param {object} environment The environment object
 * @returns {function(*=): *} A function
 */
const updateEnvironment = environment => async exists =>
	!exists
		? Promise.resolve(exists)
		: await Environments.put(exists.uid, { environment })

/**
 * Create a new collection on postman
 *
 * @param {object} environment The environment object
 * @returns {function(*): *} A function
 */
const createEnvironment = environment => async exists =>
	!exists ? await Environments.post({ environment }) : exists

/**
 * Checks if the request resulted in an error
 *
 * @param {object} results THe results object
 * @returns {object} The results object
 */
const checkForError = results => {
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
const respond = results => Promise.resolve({
	message: 'Environments created!',
	results
})

/**
 * Saves a collection to Postman
 *
 * @param {Object} environments The collection object
 * @returns {Promise<Object|Boolean>} The newly created collection or false
 */
export default async (collection, environments = null) =>
    Promise.all(environments.map(async environment => await pipe(
        environmentExists(environment.environment),
        updateEnvironment(environment.environment),
        createEnvironment(environment.environment),
        checkForError,
        respond
    )(await getEnvironments())))