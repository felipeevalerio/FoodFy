const {Pool} = require('pg')
require('dotenv').config({ path: require('find-config')('.env') })
const connectionString = "postgres://ipplfomgmnuxbj:79a7ecbd18cced39815f08468a9666386aeba0f9a7605cb4f3dfd99aa298e39d@ec2-34-228-154-153.compute-1.amazonaws.com:5432/d9i7hml2ula1oc"

module.exports = new Pool ({
    // host:process.env.DB_HOST,
    // user:process.env.DB_USER,
    // password:process.env.DB_PASSWORD,
    // port:process.env.DB_PORT,
    // database:process.env.DB_DATABASE
    connectionString
})  
