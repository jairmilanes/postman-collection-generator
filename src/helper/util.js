/**
 * Simple recursive utility
 *
 * @param {array} array The array to look into
 * @param {string} by The key to compare
 * @param {string} value The value to compare
 * @returns {null|*} Null or the value found
 */
export const rerursify = (array, by, value) => {
	/**
	 * @param {number} index The current index
	 * @returns {null|*} Null or the value found
	 */
	const r = index => {
		if (array[index][by] === value) {
			return array[index]
		}

		if (++index > array.length - 1) {
			return null
		}

		return r(index)
	}

	return r(0)
}

/**
 * Pipe functions
 *
 * @param {object} fns The fns
 * @returns {function(*=): *} The result
 */
export const pipe = (...fns) => x =>
	fns.reduce((prev, f) => prev.then(f), Promise.resolve(x))

/**
 * Pipe Sync version functions
 * @param {object} ops The fns
 * @param {object} ops The fns
 * @returns {function(*=): *} The result
 */
export const pipeSync = (first, ...ops) =>
	ops.reduce((a, b) => arg => b(a(arg)), first)
// export const pipeSync = (...fns) => x => fns.reduce((prev, f) => f, x)
