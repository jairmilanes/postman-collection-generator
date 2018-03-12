#!/usr/bin/env node
'use strict';

var _postmanSdk = require('postman-sdk');

const { collection } = _postmanSdk.Builder;

console.log('Hello, world!');

const data = build(collection(meta.name, meta.version), app._router, config);

console.log(data);