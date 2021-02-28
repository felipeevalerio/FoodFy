const db = require("../../config/db")

const Base = require("./Base")
Base.init({table:"recipes"})

module.exports = {
    ...Base,
    async create(data,userId){
        const query = `INSERT INTO recipes(
            chef_id,
            title,
            ingredients,
            preparation,
            information,
            user_id
        )VALUES($1,$2,$3,$4,$5,$6)
        RETURNING id`

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            userId
        ]

        const results = await db.query(query,values)
        return results.rows[0].id
    },
    async update(data){
        try {
            const query = `UPDATE recipes SET
            title = ($1),
            chef_id = ($2),
            ingredients = ($3),
            preparation = ($4),
            information = ($5)
            WHERE id = ($6)
            `
            const values = [
                data.title,
                data.chef,
                data.ingredients,
                data.preparation,
                data.information,
                data.id
            ]
            
            await db.query(query,values)
            return 
        } catch (err) {
            console.error(err)
        }
        
    },
    async chefOptions(){
        const results = await db.query("SELECT name,id FROM chefs")
        return results.rows
    },
    async findBy(filter){
        const query = `
            SELECT recipes.*,chefs.name,chefs.id AS chefs_id
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE recipes.title ILIKE '%${filter}%'
            OR chefs.name ILIKE '%${filter}%'
            GROUP BY recipes.id,chefs.id
            ORDER BY updated_at DESC
        `

        const results = await db.query(query)
        return results.rows

    },
    async files(id){
        query = `
            SELECT recipe_files.*,files.*
            FROM recipe_files
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            WHERE recipe_files.recipe_id = $1
        `

        const results = await db.query(query,[id])
        return results.rows
    },
    async tryDelete(id){
        await db.query("DELETE FROM files WHERE id = $1",[id])
    }
}