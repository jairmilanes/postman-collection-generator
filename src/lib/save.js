import saveToPostmanEnvironment from './../lib/save-environment'
import saveToPostmanCollection from './../lib/save-collection'
import saveToFile from './../lib/save-file'

const methods = {
    environment: saveToPostmanEnvironment,
    collection: saveToPostmanCollection,
    file: saveToFile,
    both: async (collection, environments) => ({
        collection: await saveToPostmanCollection(collection, environments),
        environment: await saveToPostmanEnvironment(collection, environments)
    }),
    '': collection => Promise.resolve(collection)
}

export default async (method, collection, environments) =>
    methods[method](collection.collection, environments)
