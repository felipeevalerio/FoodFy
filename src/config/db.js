const {Pool} = require('pg')

module.exports = new Pool ({
    host:"localhost",
    user:"",
    password:"",
    port:5432,
    database:'foodfy'
})