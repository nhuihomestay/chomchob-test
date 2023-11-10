import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';
import Ajv from 'ajv'
const ajv = new Ajv()

const result = dotenv.config({
    path: `./env/.env`,
})

const schema = {
    type: "object",
    properties: {
        DATABASE_ENV: { type: "string" },
        DATABASE_NAME: { type: "string" },
        ENDPOINT_ENV: { type: "string" },
        PORT: { type: "string" }
    },
    required: ['DATABASE_ENV', 'DATABASE_NAME', 'ENDPOINT_ENV', 'PORT']
}

const validate: any = ajv.compile(schema)
const valid = validate(result.parsed)

if (!valid) {
    const verifyENVFail = validate.errors[0].message
    throw new Error(verifyENVFail)
}

console.log(`Validate env file Success`)

if (result.error) {
    throw result.error
}