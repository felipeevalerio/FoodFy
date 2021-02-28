const express = require("express")
const routes = express.Router()

const SessionController = require("../app/controllers/SessionController") 
const UserController = require("../app/controllers/UserController") 

const UserValidator = require("../app/validators/userValidator")


const {onlyUsers,isLogged,isAdmin} = require("../app/middlewares/session")

// Login / Logout do usuário

routes.get("/login",isLogged,SessionController.loginForm)
routes.post("/login",isLogged,UserValidator.login,SessionController.login)
routes.post("/logout",onlyUsers,SessionController.logout)

// Esqueceu a senha / Resetar senha

routes.get("/forgot-password",isLogged,SessionController.forgotForm)
routes.post("/forgot-password",isLogged,UserValidator.forgot,SessionController.forgot)
routes.get("/password-reset",isLogged,SessionController.resetForm)
routes.post("/password-reset",isLogged,UserValidator.reset,SessionController.reset)

//Registrar usuário

routes.get("/register",isLogged,UserController.registerForm)
routes.post("/register",isLogged,UserValidator.register,UserController.register)

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/admin/users',isAdmin,UserController.list) //Mostrar a lista de usuários cadastrados
routes.get('/admin/users/create',isAdmin,UserController.adminCreate) 

routes.post('/admin/users',isAdmin, UserController.post) //Cadastrar um usuário
routes.get("/admin/users/:id",isAdmin,UserController.findUser)
routes.put('/admin/users',isAdmin, UserController.put) // Editar um usuário
routes.delete('/admin/users',isAdmin, UserController.delete) // Deletar um usuário    

module.exports = routes