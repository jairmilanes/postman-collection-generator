import fs from 'fs'
import path from 'path'
import { pipe } from './../helper/util'

const getPostmanDir = (directory = null) =>  path.join(
	fs.realpathSync('./'),
	!directory ? '.postman' : directory
)

/**
 * Checks the local file version to see if is different from the one in the package.json
 *
 * @param {String} current Current version
 * @returns {boolean} True if different false otherwise
 */
const checkVersion = (directory = null) => {
	try {
		const packageJson = JSON.parse(fs.readFileSync(path.join(fs.realpathSync('./'), './package.json')))

		if (!packageJson) {
			return directory || '.postman'
		}

		return path.join((directory || '.postman'), packageJson.version)
	} catch (error) {
		console.error(
			`Error while trying to read from local postman file: ${
				error.message
				}`
		)
		return directory || '.postman'
	}
}

/**
 *
 * @param {string} directory The directory where to save the collection file
 * @returns {string} The directory plus filename
 */
const getLocalFilePath = directory => path.join(directory, 'collection.json')

/**
 * Ensures the cirectory where to save the file exists
 *
 * @param {string} directory The directory where to save the collection file
 * @returns {*} The
 */
const ensureDirectoryExists = (directory = null) => {
	const localPath = getPostmanDir(directory)

	if (!fs.existsSync(localPath)) {
		fs.mkdirSync(localPath)
	}

	return localPath
}

/**
 * saveToFile constructor
 *
 * @param {object} collection The collection object
 * @returns {function(filename:string): void} Undefined
 */
const saveToFile = collection =>
	/**
	 * Saves the collection to a file given it's filename
	 *
	 * @param filename
	 */
	filename =>
		fs.writeFileSync(filename, JSON.stringify(collection), {
			flag: 'w+'
		})


/**
 * Creates a suvvess response
 *
 * @param {object} results The results object
 * @returns {object} A suvvess response object
 */
const finalize = results => Promise.resolve({
	message: 'File created!',
	results
})


/**
 * Saves a collection file
 *
 * @param {Object} collection The collection object
 * @param {object} config The config object
 * @returns {Boolean} True if all was ok
 */
export default (collection, config = {}) =>
	pipe(checkVersion, ensureDirectoryExists, getLocalFilePath, saveToFile(collection), finalize)(
		config.directory
	)
