const express = require("express") //Chamando o Express (Servidor)
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const session = require("./config/session")
const routes = require('./routes')

const server = express() //Executando

server.use(session)
server.use(express.urlencoded({extended:true}))
server.use(express.static('public')) //Olhando a pasta public
server.use(methodOverride('_method'))
server.use(routes)


server.set('view engine','njk')     //Setando Template Engine   


nunjucks.configure("src/app/views", {
    express:server,
    nocache:true,
    autoescape:false
})



server.listen(process.env.PORT || 3002,()=>{
    console.log("Server is Running...")
})