#!/usr/bin/env node
import { Builder } from 'postman-sdk'
const { collection } = Builder

console.log('Hello, world!');

const data = build(
    collection(meta.name, meta.version),
    app._router,
    config
)

console.log(data)