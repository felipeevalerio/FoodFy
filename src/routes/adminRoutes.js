const express = require("express")
const routes = express.Router()

const multer = require('../app/middlewares/multer')

const Recipe = require('../app/controllers/RecipeController')
const Chef = require('../app/controllers/ChefController')

const {onlyUsers,isAdmin,verifyIfUserIsOwner} = require("../app/middlewares/session")


//Recipes - Admin

routes.get('/recipes',onlyUsers,Recipe.indexAdmin)
routes.get('/recipes/create', onlyUsers,Recipe.create)
routes.get('/recipes/:id',onlyUsers,verifyIfUserIsOwner,Recipe.showAdmin)
routes.get('/recipes/:id/edit',onlyUsers,verifyIfUserIsOwner,Recipe.edit)

routes.post('/recipes',onlyUsers,multer.array('photos',5),Recipe.post)
routes.put('/recipes',onlyUsers,verifyIfUserIsOwner,multer.array('photos',5),Recipe.put)
routes.delete('/recipes',onlyUsers,verifyIfUserIsOwner,Recipe.delete)

//Chefs - Admin

routes.get("/chefs",onlyUsers,Chef.all)
routes.get("/chefs/register",onlyUsers,isAdmin,Chef.create)
routes.get('/chefs/:id',onlyUsers,Chef.show)
routes.get("/chefs/:id/edit",onlyUsers,isAdmin,Chef.edit)

routes.post('/chefs',onlyUsers,isAdmin,multer.array("photos",1),Chef.post)
routes.put("/chefs",onlyUsers,isAdmin,multer.array("photos",1),Chef.put)
routes.delete('/chefs',onlyUsers,isAdmin,Chef.delete)


module.exports = routes