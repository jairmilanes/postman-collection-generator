import express from 'express'
import supertest from 'supertest'
import collectionGenerator from './../index'

describe('Server: ', () => {
	const app = express()
	const router = express.Router()
	const next = jest.fn()

	const route_1 = router.route('/test-1')
	route_1
		.get((req, res, next) => res.json({ message: 'Test' }))
		.post((req, res, next) => res.json({ message: 'Test' }))

	const route_2 = router.route('/test-2')
	route_2
		.get((req, res, next) => res.json({ message: 'Test' }))
		.post((req, res, next) => res.json({ message: 'Test' }))

	app.use('/api/test/path', router)
	app.use(
		'/postman',
		collectionGenerator(app)(
			{ enabled: true },
			{ name: 'test', version: '1.0.0' }
		)
	)

	const request = supertest(app)

	it('Should contain 3 routes', () => {
		expect(
			app._router.stack.filter(route => route.name === 'router')
		).toHaveLength(2)
	})

	it('Should contain route with /api path', () => {
		expect(
			app._router.stack.filter(
				route => route.regexp.source.indexOf('/api') > -1
			)
		).toHaveLength(1)
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
				console.info(response.body.collection.item)
			})
	})

	it('Should save a collection as a local file', done => {
		request
			.get('/postman/generate-collection')
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				// console.info(response.body.collection.item)
				expect(response.body).toMatchObject({
					collection: {
						info: {
							name: expect.any(String),
							schema:
								'https://schema.getpostman.com/json/collection/v2.0.0/collection.json'
						},
						item: expect.anything()
					}
				})
			})
	})
})
