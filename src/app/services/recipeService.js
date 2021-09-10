const Recipe = require("../models/Recipe")


async function getFiles(recipeId){
    let files = await Recipe.files(recipeId)
    files = files.map(file =>({
        ...file,
        src:`${file.path.replace("public","")}`
    }))
    
    return files
}

async function format(recipe){
    try {
        const files = await getFiles(recipe.id)
        recipe.img = files[0]?.src == undefined ? "/assets/burger.png" : files[0].src
        recipe.files = files
        return recipe
    } catch (err) {
        console.error(err);
    }

}

const recipeService = {
    load(service,filter){
        this.filter = filter
        return this[service]()
    },
    async recipe(){
        try {
            const recipe = await Recipe.findOne(this.filter)
            return format(recipe)
        } catch (err) {
            console.error(err)
        }
    },
    async recipes(){
        try {
            const recipes = await Recipe.findAll(this.filter)
            const recipesPromise = recipes.map(format) // recipes.map(recipes => format(recipes))
            return Promise.all(recipesPromise)
        } catch (err) {
            console.error(err)
        }
        
    },
    format
}

module.exports = recipeService
