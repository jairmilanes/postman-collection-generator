import express from 'express'
import fs from 'fs'
import path from 'path'
import build from './lib/builder'
import { pipe } from 'lodash/fp'
import { Builder } from 'postman-sdk'
import saveEnvironment from './lib/environment'
import saveCollection from './lib/collection'
const { collection } = Builder

/**
 * Builds a postman collection
 *
 * @param {Object} app The models object
 * @param {Object} config The config object
 * @returns {Object} The collection file
 */
const generateCollection = app => (config, meta = {}) => {
	const router = express.Router()
	router.route('/generate-collection').get(async (req, res, next) => {
		const data = await build(
			collection(meta.name, meta.version),
			app._router,
			config
		)

		if (!req.params.postman) {
			return res.json(data)
		}

		if (req.params.postman === 'local') {
			return res.json(saveCollectionFile(data))
		}

		if (req.params.postman === 'cloud') {
			return res.json(pipe([saveCollection, saveEnvironment])(data))
		}
	})

	return router
}

/**
 * Checks the local file version to see if is different from the one in the package.json
 *
 * @param {String} current Current version
 * @returns {boolean} True if different false otherwise
 */
const checkVersion = current => {
	try {
		const postmanDir = path.join(fs.realpathSync('./'), '.postman')
		const file = path.join(postmanDir, 'collections.json')

		if (!fs.existsSync(file)) {
			return true
		}

		const json = JSON.parse(fs.readFileSync(file))
		return json.info.version !== current
	} catch (error) {
		console.error(
			`Error while trying to read from local postman file: ${
				error.message
			}`
		)
		return true
	}
}

/**
 * Saves a collection file
 *
 * @param {Object} collection The collection object
 * @returns {Boolean} True if all was ok
 */
const saveCollectionFile = collection => {
	fs.writeFileSync(getLocalFilePath(), JSON.stringify(collection), {
		flag: 'w+'
	})

	return collection
}

const getLocalFilePath = () =>
	path.join(ensureDirectoryExists(), 'collections.json')

const ensureDirectoryExists = () => {
	const postmanDir = path.join(fs.realpathSync('./'), '.postman')

	if (!fs.existsSync(postmanDir)) {
		fs.mkdirSync(postmanDir)
	}

	return postmanDir
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

export default generateCollection
