'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _postmanSdk = require('postman-sdk');

const { environment } = _postmanSdk.Builder;

exports.default = (collection, environments) => environments.map(env => {
	const name = `${collection.info.name.toUpperCase()}_${env.name.toUpperCase()}`;
	const newEnv = environment(name);

	env.values.map(variable => newEnv.add(variable));

	return newEnv;
});