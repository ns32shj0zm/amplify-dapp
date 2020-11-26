/* eslint-disable @typescript-eslint/no-var-requires */
const env = require('dotenv')
const fs = require('fs')
const path = require('path')
const res = env.config({ path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`) })
const str = `export const baseService = '${res.parsed.BASIC_SERVICE}'
`
fs.writeFileSync(path.join(__dirname, '../src/app/utils/config.ts'), str)
