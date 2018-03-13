import fs from 'fs'
import path from 'path'
import pipe from 'lodash/fp/pipe'

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
	const localPath = path.join(
		fs.realpathSync('./'),
		!directory ? '.postman' : directory
	)

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
 * Saves a collection file
 *
 * @param {Object} collection The collection object
 * @param {object} config The config object
 * @returns {Boolean} True if all was ok
 */
export default (collection, config = {}) =>
	pipe([ensureDirectoryExists, getLocalFilePath, saveToFile(collection)])(
		config.directory
	)
