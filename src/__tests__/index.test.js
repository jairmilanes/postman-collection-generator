process.env.POSTMAN_API_KEY = 'f21a2bb08f334fc4b7dc11143cfabf5d'
process.env.BASE_PATH = __dirname

import getUuidByString from 'uuid-by-string'
import express from 'express'
import supertest from 'supertest'
import collectionGenerator from './../index'
import { Collections, Environments } from 'postman-sdk'

const ITEM_1 = { name: '/test-endpoint', method: 'GET' }
const ITEM_2 = { name: '/test-endpoint-2', method: 'POST' }
const FOLDER_1 = { name: 'folder 1' }
ITEM_1.id = getUuidByString(ITEM_1.method + ITEM_1.name)
ITEM_2.id = getUuidByString(ITEM_2.method + ITEM_2.name)
FOLDER_1.id = getUuidByString(FOLDER_1.name)

describe('Server: ', () => {
	const app = express()
	const router = express.Router()

	const route_1 = router.route(ITEM_1.name)
	route_1
		.get((req, res, next) => res.json({ message: 'Test' }))
		.post((req, res, next) => res.json({ message: 'Test' }))

	const route_2 = router.route(ITEM_2.name)
	route_2
		.get((req, res, next) => res.json({ message: 'Test' }))
		.post((req, res, next) => res.json({ message: 'Test' }))

	app.use('/api/test/path', router)

	app.use('/api/test/path-empty', express.Router())
	app.use(
		'/postman',
		collectionGenerator(app)(
			{
				enabled: true,
				environments: [
					{
						name: 'production',
						values: [
							{
								key: 'HOST',
								value: 'HOST'
							},
							{ key: 'PORT', value: 'PORT' },
							{ key: 'PROTOCOL', value: 'PROTOCOL' }
						]
					},
					{
						name: 'staging',
						values: [
							{
								key: 'HOST',
								value: 'HOST'
							},
							{ key: 'PORT', value: 'PORT' },
							{ key: 'PROTOCOL', value: 'PROTOCOL' }
						]
					},
					{
						name: 'development',
						values: [
							{
								key: 'HOST',
								value: 'HOST'
							},
							{ key: 'PORT', value: 'PORT' },
							{ key: 'PROTOCOL', value: 'PROTOCOL' }
						]
					}
				]
			},
			{
				name: 'test',
				version: '1.0.0'
			}
		)
	)

	const request = supertest(app)

	it('Should contain 3 routes', () => {
		expect(
			app._router.stack.filter(route => route.name === 'router')
		).toHaveLength(3)
	})

	it('Should contain route with /api path', () => {
		expect(
			app._router.stack.filter(
				route => route.regexp.source.indexOf('/api') > -1
			)
		).toHaveLength(2)
	})

	it('Should contain route with /postman path', () => {
		expect(
			app._router.stack.filter(
				route => route.regexp.source.indexOf('/postman') > -1
			)
		).toHaveLength(1)
	})

	it('Should contain a /postman/generate-collection', () => {
		expect(
			app._router.stack.filter(
				route => route.regexp.source.indexOf('/postman') > -1
			)[0].handle.stack
		).toHaveLength(1)

		expect(
			app._router.stack.filter(
				route => route.regexp.source.indexOf('/postman') > -1
			)[0].handle.stack[0].route.path
		).toEqual('/generate-collection')
	})

	it('Should get a collection as response', done => {
		request
			.get('/postman/generate-collection')
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				expect(response.body).toMatchObject({
					info: {
						name: expect.any(String),
						schema:
							'https://schema.getpostman.com/json/collection/v2.0.0/collection.json'
					},
					item: expect.anything()
				})
				done()
			})
	})

	it('Should save a collection as a local file', done => {
		request
			.get('/postman/generate-collection?postman=file')
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				done()
			})
	})

	it('Should save a collection to postman', done => {
		Collections.get = jest.fn(() =>
			Promise.resolve({
				collections: [
					{
						id: 'dac5eac9-148d-a32e-b76b-3edee9da28f7',
						name: 'Cloud API',
						owner: '631643',
						uid: '631643-dac5eac9-148d-a32e-b76b-3edee9da28f7'
					},
					{
						id: 'f2e66c2e-5297-e4a5-739e-20cbb90900e3',
						name: 'Sample Collection',
						owner: '631643',
						uid: '631643-f2e66c2e-5297-e4a5-739e-20cbb90900e3'
					},
					{
						id: 'f695cab7-6878-eb55-7943-ad88e1ccfd65',
						name: 'Postman Echo',
						owner: '631643',
						uid: '631643-f695cab7-6878-eb55-7943-ad88e1ccfd65'
					}
				]
			})
		)
		Environments.get = jest.fn(() =>
			Promise.resolve({
				environments: [
					{
						id: '357668d2-84f1-2264-438b-113095359f80',
						name: 'Postman Cloud API',
						owner: '631643',
						uid: '631643-357668d2-84f1-2264-438b-113095359f80'
					},
					{
						id: '84a119b6-f4b1-9120-5f11-a73b17818d70',
						name: 'Postman Cloud API.template',
						owner: '631643',
						uid: '631643-84a119b6-f4b1-9120-5f11-a73b17818d70'
					}
				]
			})
		)
		Collections.post = jest.fn(() =>
			Promise.resolve({
				collection: {
					id: '2412a72c-1d8e-491b-aced-93809c0e94e9',
					name: 'Sample Collection',
					uid: '5852-2412a72c-1d8e-491b-aced-93809c0e94e9'
				}
			})
		)

		Environments.post = jest.fn(() =>
			Promise.resolve({
				environment: {
					id: 'f158266e-306b-4702-a2b9-e4ede7878b7a',
					name: 'Sample Environment Name (required)',
					uid: '5665-f158266e-306b-4702-a2b9-e4ede7878b7a'
				}
			})
		)

		Collections.put = jest.fn(() =>
			Promise.resolve({
				collection: {
					id: '1d3daef4-2037-4584-ab86-bafd8c8f8a55',
					name: 'Sample Collection',
					uid: '5852-1d3daef4-2037-4584-ab86-bafd8c8f8a55'
				}
			})
		)

		Environments.put = jest.fn(() =>
			Promise.resolve({
				environment: {
					id: '357668d2-84f1-2264-438b-113095359f80',
					name: 'New Name',
					uid: '631643-357668d2-84f1-2264-438b-113095359f80'
				}
			})
		)

		request
			.get('/postman/generate-collection?postman=both')
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				expect(Collections.get).toHaveBeenCalledTimes(1)
				expect(Environments.get).toHaveBeenCalledTimes(3)
				expect(Collections.post).toHaveBeenCalledTimes(1)
				expect(Environments.post).toHaveBeenCalledTimes(3)
				expect(response.body).toHaveProperty('collection')
				expect(response.body.collection).toMatchObject({
					message: 'Collection created!',
					results: expect.anything()
				})
				expect(response.body).toHaveProperty('environment')
				expect(response.body.environment).toHaveLength(3)
				expect(response.body.environment[0]).toMatchObject({
					message: 'Environments created!',
					results: expect.anything()
				})
				done()
			})
	})
})
