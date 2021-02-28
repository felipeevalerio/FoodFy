const db = require("../../config/db")

const Base = require("./Base")
Base.init({table:"chefs"})

module.exports = {
    ...Base,
    async recipes(id){
        const query = `
            SELECT * FROM recipes WHERE recipes.chef_id = $1
        `
        
        const results = await db.query(query,[id])
        return results.rows
    },
    async files(id){
        const query = `
            SELECT chef_files.*,files.*
            FROM chef_files
            LEFT JOIN files ON (chef_files.file_id = files.id)
            WHERE chef_files.chef_id = $1
        `
        
        const results = await db.query(query,[id])
        return results.rows[0]
    }
}