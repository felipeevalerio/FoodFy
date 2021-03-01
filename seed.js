const User = require("./src/app/models/User")
const Recipe = require("./src/app/models/Recipe")
const File = require("./src/app/models/File")
const Chef = require("./src/app/models/Chef")

const faker = require("faker")
const {hash} = require("bcryptjs")


let usersIds = [],
    chefsIds = [],
    totalChefs = 3,
    totalUsers = 3,
    totalRecipes = 9

async function createUsers(){
    try {
        let users = []
        while(users.length < 3){
            users.push({
                name:faker.name.firstName(),
                email:faker.internet.email(),
                password: await hash("1234",8),
                is_admin:Math.floor(Math.random() * 2) > 0 ? true : false
            })
        }
    
        const usersPromise = users.map(user => User.create(user))
        usersIds = await Promise.all(usersPromise)        
        
    } catch (err) {
        console.error(err)
    }
    
}

async function createChefs(){
    try {
        let chefs = []

        while(chefs.length < totalChefs){
            chefs.push({
                name:faker.name.firstName()
            })
        }
    
        const chefsPromise = chefs.map( chef =>  Chef.create(chef))
        chefsIds = await Promise.all(chefsPromise)
    
        let files = []
        for(let i =0; i < totalChefs; i++){
            files.push({
                name:faker.image.image(),
                path:`/assets/asinhas.png`,
                chef_id:chefsIds[i]
            })
        }
        const filesPromise = files.map(async file => {
            const fileId = await File.create({
                name:file.name,
                path:file.path
            })
    
            await File.chefFiles(file.chef_id,fileId)
        })
    
        files = await Promise.all(filesPromise)        

        const chefsFilesPromise = chefsIds.map(async chefId =>{
            const chef = await Chef.find(chefId)
            chef.files = await Chef.files(chef.id)
            if(chef.files.length > 1){
                const filteredFiles = a.slice(1,-1)
                const filePromise = filteredFiles.map(file =>{
                    File.deleteChefFiles(file.id)
                    File.delete(file.id)
                })
                await Promise.all(filePromise)
            }
    
        })
        
        await Promise.all(chefsFilesPromise)
    } catch (err) {
        console.error(err)
    }
    
}

async function createRecipes(){
    try {
        let recipes = []

        while(recipes.length < totalRecipes){
            recipes.push({
                title:faker.lorem.word(),
                ingredients:[faker.lorem.words(2),faker.lorem.words(2)],
                preparation:[faker.lorem.words(2),faker.lorem.words(2),faker.lorem.words(2)],
                information:faker.lorem.paragraph(Math.floor(Math.random() * 10)),
                chef:chefsIds[Math.floor(Math.random() * totalChefs)],
                user_id:usersIds[Math.floor(Math.random() * totalUsers)]
            })
        }
        const recipesPromise = recipes.map(recipe => Recipe.create(recipe,recipe.user_id))
        let recipesIds = await Promise.all(recipesPromise)

        let files = []

        while(files.length < recipes.length * 4){
            files.push({
                name:faker.image.image(),
                path:`/assets/espaguete.png`,
                recipe_id:recipesIds[Math.floor(Math.random() * totalRecipes)]
            })
        }

        const filesPromise = files.map(async file => {
            const fileId = await File.create({
                name:file.name,
                path:file.path
            })

            await File.recipeFiles(file.recipe_id,fileId)
        })
        
        files = await Promise.all(filesPromise)

        const recipeFilesPromise = recipesIds.map(async recipeId =>{
            const recipe = await Recipe.find(recipeId)
            recipe.files = await Recipe.files(recipe.id)
            if(recipe.files.length > 5){
                const filteredFiles = recipe.files.slice(4,-1)
                const filePromise = filteredFiles.map(file =>{
                    File.delete(file.id)
                    File.deleteFiles(file.id)
                })
            await Promise.all(filePromise)
            }
        })

        await Promise.all(recipeFilesPromise)

    } catch (err) {
        console.error(err)
    }
    
}

async function init(){
    try{
        await createUsers()
        await createChefs()
        await createRecipes()
        console.log("Seeds criadas com sucesso!")
    }
    catch(err){
        console.error(err)
    }
}

init()
