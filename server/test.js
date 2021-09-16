const path = require('path')

// Require Provider
const lti = require('ltijs').Provider
const Database = require('ltijs-sequelize')

// Setup ltijs-sequelize using the same arguments as Sequelize's generic contructor
const db = new Database('learnWebApps', 'webAdmin', 'defaultPasswort',
    {
        host: 'localhost',
        dialect: 'postgres',
        logging: false
    })

// Setup provider
lti.setup('LTIKEY', // Key used to sign cookies and tokens
    {
        plugin: db // Passing db object to plugin field
    },
    { // Options
        appRoute: '/', loginRoute: '/login', // Optionally, specify some of the reserved routes
        cookies: {
            secure: false, // Set secure to true if the testing platform is in a different domain and https is being used
            sameSite: '' // Set sameSite to 'None' if the testing platform is in a different domain and https is being used
        },
        devMode: false // Set DevMode to true if the testing platform is in a different domain and https is not being used
    }
)

// Set lti launch callback
lti.onConnect((token, req, res) => {
    console.log(token)
    return res.send('It\'s alive!')
})

const setup = async () => {
    // Deploy server and open connection to the database
    await lti.deploy({port: 3000}) // Specifying port. Defaults to 3000

    // Register platform
    await lti.registerPlatform({
        url: 'https://platform.url',
        name: 'Platform Name',
        clientId: 'TOOLCLIENTID',
        authenticationEndpoint: 'https://platform.url/auth',
        accesstokenEndpoint: 'https://platform.url/token',
        authConfig: {method: 'JWK_SET', key: 'https://platform.url/keyset'}
    })
}

setup()