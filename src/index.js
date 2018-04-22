import fs from 'fs'
import express from 'express'
import { Builder } from 'postman-sdk'
import buildCollection from './lib/build-collection'
import buildEnvironment from './lib/build-environment'
import save from './lib/save'
const { collection } = Builder

/**
 * Builds a postman collection
 *
 * @param {Object} app The models object
 * @param {Object} config The config object
 * @returns {Object} The collection file
 */
const collectionGenerator = (app, config) => {
	const router = express.Router()

	router.route('/generate-collection').get(async (req, res, next) => {
		const newCollection = await buildCollection(
			collection(meta.name, meta.version),
			app._router,
			config
		)

		const newEnvironments = buildEnvironment(
			newCollection.collection,
			config.environments
		)

		return res.json(
			await save(req.query.postman || '', newCollection, newEnvironments)
		)
	})

	return router
}

/**
 * Response helper
 * @param {object} req The request object
 * @param {object} res The response object
 * @param {function} next The callback function
 * @returns {undefined} Nothing
 */
const error = (req, res, next) => {
	req.fulfilled = true
	res.data = {
		message: 'The postman collection generator is disabled!'
	}
	return next()
}

export default collectionGenerator
