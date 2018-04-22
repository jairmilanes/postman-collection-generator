import fs from 'fs'
import { findBy } from './../helper/util'

describe('Unit: ', () => {
	it('Should find by', () => {
		expect(
			findBy([{ name: 'test' }, { name: 'test 1' }], 'name', 'test 1')
		).toMatchObject({ name: 'test 1' })
	})

	it('Should not find by', () => {
		expect(
			findBy([{ name: 'test' }, { name: 'test 1' }], 'name', 'test 3')
		).toBeNull()
	})
})
