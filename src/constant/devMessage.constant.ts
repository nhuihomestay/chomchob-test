const DEV_MESSAGE = Object.freeze({
    SUCCESS: { code: 200000, status: 200, devMessage: 'Success' },

    UNAUTHORIZED: { code: 401000, status: 401, devMessage: 'Unauthorized' },
    ACCESS_DENIED: { code: 401001, status: 401, devMessage: 'Access Denied' },
    WRONG_PASSWORD: { code: 401110, status: 401, devMessage: 'Wrong Password' },
    NOT_ENOUGH_TOKEN: { code: 400102, status: 400, devMessage: 'Not enough token' },
    DUPLICATE_USERNAME: { code: 400103, status: 400, devMessage: 'Cannot use duplicate username' },
    CANT_UPDATE: { code: 400104, status: 400, devMessage: 'Cannot be update'},
    ACCOUNT_NOT_FOUND: { code: 404001, status: 404, devMessage: 'Account Not Found' },
})

export { DEV_MESSAGE }