const {Pool} = require('pg')

module.exports = new Pool ({
    host:"localhost",
    user:"postgres",
    password:"123",
    port:5432,
    database:'foodfy'
})