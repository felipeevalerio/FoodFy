const express = require('express')
const routes = express.Router()

const Recipe = require("../app/controllers/RecipeController")
const Chef = require('../app/controllers/ChefController')

const userRoutes = require("./userRoutes")
const profileRoutes = require("./profileRoutes")
const adminRoutes= require("./adminRoutes")

routes.use("/users",userRoutes)
routes.use("/profile",profileRoutes)
routes.use("/admin",adminRoutes)

routes.get('/',Recipe.index)

routes.get('/sobre',(req,res)=>{
    return res.render("not-users/sobre")
})

routes.get('/recipes',Recipe.allRecipes)

routes.get("/recipes/:id",Recipe.show)

routes.get('/chefs',Chef.allIndex)
routes.get("/chefs/:id",Chef.showIndex)



//Alias

routes.get("/register",(req,res)=>{
    return res.redirect("/users/register")
})

routes.get("/login",(req,res)=>{
    return res.redirect("/users/login")
})

module.exports = routes