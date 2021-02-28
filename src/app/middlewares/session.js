const User = require("../models/User")
const Recipe = require("../models/Recipe")

const {format} = require("../services/recipeService")

function onlyUsers(req,res,next){
    if(!req.session.userId)
        return res.redirect("/login")
    next()
}

function isLogged(req,res,next){
    if(req.session.userId)
        return res.redirect("/profile")
    
    next()
}

async function isAdmin(req,res,next){
    const userId = req.session.userId
    const user = await User.findOne({where:{id:userId}})
    if(user == null ) return res.redirect("/login")
    if(!user.is_admin)
        return res.render("admin/users/index",{
            user,
            error:"Você não tem permissão pra entrar nessa área"
        })
    next()
}

async function verifyIfUserIsOwner(req,res,next){
    try {
        const currentUser = req.session.userId
        const user = await User.findOne({where:{id:currentUser}})
        const recipe = await Recipe.find(req.params.id)

        const chefs = await Recipe.chefOptions()

        const recipeBy = chefs.find(chef => {
            if(user.is_admin || chef.id == recipe.chef_id){
                return chef  
            }
        })

        if(!user.is_admin && recipe.user_id != currentUser){
            await format(recipe)
            return res.render("admin/recipes/recipe-cant-edit",{
                item:recipe,
                chef:recipeBy.name
            })
        }
    } catch (err) {
        console.error(err)
    }

    next()
}


module.exports = {
    onlyUsers,
    isLogged,
    isAdmin,
    verifyIfUserIsOwner
}