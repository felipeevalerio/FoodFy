const {Pool} = require('pg')
require('dotenv').config({ path: require('find-config')('.env') })

module.exports = new Pool ({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    database:process.env.DB_DATABASE,
    ssl:{
        rejectUnauthorized:false
    }
})  
