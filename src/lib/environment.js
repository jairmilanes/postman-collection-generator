import { Environments, Builder } from 'postman-sdk'
const { environment } = Builder

/**
 * Saves an environment to post man
 *
 * @param {object} payload The object payload
 * @param {object} config The config object
 * @returns {Promise<any[]>} A Promise
 */
const save = config => async (payload, config) =>
	config.environments.map(async env => {
		const name = `${payload.collection.info.name.toUpperCase()}_${env.name.toUpperCase()}`
		const newEnv = environment(name)

		config.values.map(variable => newEnv.add(variable))

		try {
			const exists = await exists(name)

			console.info('COLLECTION EXISTS?', exists)

			let results
			if (!exists) {
				results = await Environments.post(newEnv)
			} else {
				results = await Environments.put(exists.id, newEnv)
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

			console.info(
				`Environment ${results.environment.name} (${
					results.environment.id
				}) Saved To Postman!`
			)

			return results.environment
		} catch (error) {
			console.error(
				`Could not save collection to Postman: ${error.message}`,
				error
			)

			return false
		}
	})

/**
 * Checks if a collection exists on postman
 *
 * @param {String} name The collection name
 * @returns {Promise<object|boolean>} The collection object if it exists false otherwise
 */
const exists = async name => {
	try {
		const results = await Environments.get()

		if (results.environment) {
			const filerCollection = results.environment.filter(
				environment => environment.name === name
			)
			return filerCollection.length > 0 ? filerCollection[0] : false
		}

		return false
	} catch (error) {
		console.error(
			`Error while trying to check if the environment "${name}" exists: ${
				error.message
			}`
		)
		return false
	}
}

export default save
