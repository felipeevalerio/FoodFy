const Recipe = require('../models/Recipe')
const File = require("../models/File")

const recipeService = require("../services/recipeService")

module.exports = {
    async index(req, res) {
        try {
          const allRecipes = await recipeService.load("recipes")
          const recipesPromise = allRecipes
            .filter((recipe, index) => index > 5 ? false : true)
            .map(async recipe => {
                const chefs = await Recipe.chefOptions()
                recipe.chef = chefs.find(chef => chef.id == recipe.chef_id ? true : false)
                return recipe
            })
    
            const recipes = await Promise.all(recipesPromise)
            return res.render("not-users/index", { items: recipes})
        } catch (err) {
          console.error(err)    
        }
    
    },
    async allRecipes(req, res) {
        try {
            let { filter } = req.query

            let recipes = await recipeService.load("recipes")

            const recipesPromise = recipes.map(async recipe => {
            const chefs = await Recipe.chefOptions()
            recipe.chef = chefs.find(chef => chef.id == recipe.chef_id ? true : false)
            return recipe
            })

            recipes = await Promise.all(recipesPromise)

            if (filter) {
                const filtered = await Recipe.findBy(filter)

                const recipesPromise = filtered.map(async recipe => {
                    await recipeService.format(recipe)
                    const chefs = await Recipe.chefOptions()
                    recipe.chef = chefs.find(chef => chef.id == recipe.chef_id ? true : false)
                    return recipe
                })

                recipes = await Promise.all(recipesPromise)
                
                return res.render('not-users/recipes/recipes', { items: recipes })
            }
            else {
                return res.render("not-users/recipes/recipes", { items: recipes })
            }

        } catch (err) {
            console.error(err)
        }

    },
    async show(req, res) {
        try {
            const recipe = await recipeService.load("recipe",{WHERE:{id:req.params.id}})
        
            if(!recipe) return res.redirect("/recipes")
        
            if(recipe.files.length > 5){
            recipe.files = recipe.files.slice(0,5)
            }
        
            const chefs = await Recipe.chefOptions()
        
            const recipeBy = chefs.find(chef => chef.id == recipe.chef_id ? true : false)
        
            return res.render("not-users/recipes/recipe", { item: recipe, chef: recipeBy.name})
        } catch (err) {
            console.error(err)
        }
    },
    async indexAdmin(req,res){
        try{
            const allRecipes = await recipeService.load("recipes")
            const recipesPromise = allRecipes.map(async recipe =>{
                const chefs = await Recipe.chefOptions()
                recipe.chef = chefs.find(chef => chef.id == recipe.chef_id ? true : false)
                return recipe
            })

            const recipes = await Promise.all(recipesPromise)

            return res.render("admin/recipes/index",{items:recipes})}
        catch(err){
            console.error(err)
        }
    },
    async create(req,res){
        try{
            const chefs = await Recipe.chefOptions()
            return res.render("admin/recipes/register",{options:chefs})
        }
        catch(err){
            console.error(err)
        }

    },
    async post(req,res){    
        try{

            const sendFiles = req.files
    
            if(sendFiles.length == 0){
                return res.render("admin/recipes/register",{
                    error:"Por favor, selecione ao menos 1 imagem!",
                    ...req.body

                })
            }

            const recipeId = await Recipe.create(req.body,req.session.userId)
            
            const filesPromise= sendFiles.map(async file =>{
                const fileId = await File.create({
                    name:file.filename,
                    path:file.path
                })
                await File.recipeFiles(recipeId,fileId)
            })
    
            await Promise.all(filesPromise)

            return res.redirect(`/admin/recipes/${recipeId}`)
        }
        catch(err){
            console.error(err)
        }
    },
    async showAdmin(req,res){
        try{
            const recipe = await Recipe.find(req.params.id)
            
            if(!recipe) return res.render("Recipe Not Found")

            const chefs = await Recipe.chefOptions()

            const recipeBy = chefs.find(chef => {
                if(chef.id == recipe.chef_id){
                    return chef  
                }
            })

            let files = await Recipe.files(recipe.id)
            files = files.map(file =>({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }))

            return res.render('admin/recipes/recipe',{item:recipe,chef:recipeBy.name,files})
        }
        catch(err){
            console.error(err)
        }
    },
    async edit(req,res){
        try{
            const recipe = await Recipe.find(req.params.id)

            if(!recipe) return res.send("Recipe Not Found")

            const chefs = await Recipe.chefOptions() 
                    
            let files = await Recipe.files(recipe.id)

            const filesPromise = files.map(file =>({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`}))
            
            files = await Promise.all(filesPromise)

            return res.render(`admin/recipes/edit`,{item:recipe,options:chefs,files})
        }
        catch(err){
            console.error(err)
        }
    },  
    async put(req,res){
        try{
            if(req.files.length != 0){
                const filesPromise= req.files.map(async file =>{
                    try {
                        const newFile = await File.create({
                            name:file.filename,
                            path:file.path
                        })
                        await File.recipeFiles(req.body.id,Number(newFile))
                    } catch (err) {
                        console.error(err)
                    }
                    
                })
        
                await Promise.all(filesPromise)

            }

            if(req.body.removed_files){
                const removed_files = req.body.removed_files.split(',')
                const lastIndex = removed_files.length - 1

                removed_files.splice(lastIndex,1)

                const removedFilesPromise = removed_files.map(id=>{
                    File.delete(id)
                    File.deleteFiles(id)
                })

                await Promise.all(removedFilesPromise)
            }

            await Recipe.update(req.body)
            
            return res.redirect(`/admin/recipes/${req.body.id}`)
        }
        catch(err){
            console.error(err)
        }
    },
    async delete(req,res){
        try{
            await Recipe.delete(req.body.id)
            return res.redirect("/admin/recipes")
        }
        catch(err){
            console.error(err)
        }
    }
}
