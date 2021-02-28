const Chef = require('../models/Chef')
const File = require("../models/File")
const User = require('../models/User')

const recipeService = require("../services/recipeService")

function checkAllFields(body) {
    const keys = Object.keys(body)
    for (let key of keys) {
        if (body[key] == "")
            return true
    }
}

module.exports = {
    async all(req,res){
        try{
            const user = await User.find(req.session.userId)

            let chefs = await Chef.findAll()
            
            async function getImage(chefId){
                let files = await Chef.files(chefId)
                files = files.path.replace("public","")
                return files
            }

            const filesPromise = chefs.map( async chef =>{
                chef.img = await getImage(chef.id)
                return chef
            })

            chefs = await Promise.all(filesPromise)

            return res.render("admin/chefs/index",{items:chefs,user})
        }   
        catch(err){
            console.error(err)
        }
    },
    async allIndex(req,res){
        try{
            let chefs = await Chef.findAll()
            
            async function getImage(chefId){
                let files = await Chef.files(chefId)
                files = files.path.replace("public","")
                return files
            }

            const filesPromise = chefs.map( async chef =>{
                chef.img = await getImage(chef.id)
                return chef
            })

            chefs = await Promise.all(filesPromise)

            return res.render("not-users/chefs/index",{items:chefs})
        }
        catch(err){
            console.error(err)
        }
    },
    create(req,res){
        return res.render('admin/chefs/register')
    },
    async post(req,res){
        try{
            const sendFiles = req.files

            if(sendFiles.length == 0)
                return res.render("admin/chefs/register",{
                    error:"Por favor, insira ao menos 1 imagem.",
                    chef:req.body
            })
            
            const allFields = checkAllFields(req.body)
            if(allFields)
                return res.render("admin/chefs/register",{
                    error:"Por favor,preencha todos os campos.",
                    chef:req.body
                })

            const { name } = req.body
            
            const chef = await Chef.create({
                name
            })

            const filesPromise = sendFiles.map(async file =>{
                const fileId = await File.create({
                    name:file.filename,
                    path:file.path
                })
                await File.chefFiles(chef,fileId)
            })

            await Promise.all(filesPromise)
            
            return res.redirect(`/admin/chefs/${chef}`)
        }
        catch(err){
            console.error(err)
        }
    },  
    async show(req,res){
        try{
            const user = await User.find(req.session.userId)
           
            const chef = await Chef.find(req.params.id)
        
            if(!chef) return res.redirect("/admin/chefs")

            //pega as receitas do chef
            let recipes = await Chef.recipes(chef.id)
        
            async function getImageChef(chefId){
                let files = await Chef.files(chefId)
                files = files.path.replace("public","")
                return files
            }
            
            const recipeFiles = recipes.map(async recipe =>{
                await recipeService.format(recipe)
                return recipe
            })

            chef.img = await getImageChef(chef.id)
            chef.total_recipes = recipes.length
            recipes = await Promise.all(recipeFiles)

            return res.render("admin/chefs/chef",{chef,recipes,user})
            }
        catch(err){
            console.error(err)
        }
        },
    async showIndex(req,res){
        try{
            const chef = await Chef.find(req.params.id)
    
            if(!chef) return res.redirect("/admin/chefs")

            //pega as receitas do chef
            let recipes = await Chef.recipes(chef.id)
        
            async function getImageChef(chefId){
                let files = await Chef.files(chefId)
                files = files.path.replace("public","")
                return files
            }
            
            const recipeFiles = recipes.map(async recipe =>{
                await recipeService.format(recipe)
                return recipe
            })

            chef.img = await getImageChef(chef.id)
            chef.total_recipes = recipes.length
            recipes = await Promise.all(recipeFiles)

            return res.render("not-users/chefs/chef",{chef,recipes})
        } 
        catch(err){
            console.error(err)
        }
    },
    async edit(req,res){
        try{
            const chef = await Chef.find(req.params.id)
    
            if(!chef) return res.send("Chef not Found")

            const files = await Chef.files(chef.id)
            if(files.length > 1) return res.redirect(`admin/chefs/${chef.id}`)

            files.src = files.path.replace("public","")
            return res.render('admin/chefs/edit',{chef,files})
        }
        catch(err){ 
            console.error(err)
        }
    },
    async put(req,res){
        try{
            //Cria novos arquivos se exitir algum
            if(req.files.length != 0){
                const filesPromise= req.files.map(async file =>{
                    try {
                        const fileId = await File.create({
                            name:file.filename,
                            path:file.path
                        })
                        await File.chefFiles(req.body.id,fileId)
                    } catch (err) {
                        console.error(err)
                    }
                    
                })
        
                await Promise.all(filesPromise)

            }

            if(req.body.removed_files){

                const removed_files = req.body.removed_files.split(',')

                const removedFilesPromise = removed_files.map( id=>{
                    File.deleteChefFiles(id)
                })

                await Promise.all(removedFilesPromise)
            }

            const {name} = req.body

            await Chef.update(req.body.id,{name})

            return res.redirect(`/admin/chefs/${req.body.id}`)
        }
        catch(err){
            console.error(err)
        }
    },
    async delete(req,res){
        try{
            await Chef.delete(req.body.id)
            return res.redirect('/admin/chefs')
        }
        catch(err){
            console.error(err)
        }
    }
}





