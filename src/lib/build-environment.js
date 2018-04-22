import { Builder } from 'postman-sdk'
const { environment } = Builder

export default (collection, environments) =>
	environments.map(env => {
		const name = `${collection.info.name.toUpperCase()}_${env.name.toUpperCase()}`
		const newEnv = environment(name)

		env.values.map(variable => newEnv.add(variable))

		return newEnv
	})
