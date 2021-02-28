const express = require("express")
const routes = express.Router()

const ProfileController = require("../app/controllers/ProfileController")
const UserValidator = require("../app/validators/userValidator")

// Rotas de perfil de um usuário logado
routes.get('/',UserValidator.index,ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/',UserValidator.put,ProfileController.put)// Editar o usuário logado

module.exports = routes