const db = require('../../config/db')
const fs = require('fs')

const Base = require("./Base")
Base.init({table:"files"})

module.exports = { 
    ...Base,
    recipeFiles(recipe_id,file_id){
        const query = `
        INSERT INTO recipe_files (
            recipe_id,
            file_id
        ) VALUES ($1,$2)
        RETURNING id`

        const values = [
            recipe_id,
            file_id
        ]

        return db.query(query,values)
    },
    async chefFiles(chef_id,file_id){
        const query = `
        INSERT INTO chef_files (
            chef_id,
            file_id
        ) VALUES ($1,$2) 
        RETURNING id`
        
        const values = [
            chef_id,
            file_id
        ]

        const results = await db.query(query,values)
        return results.rows
    },
    async delete(id){
        try{
            //Pegar os files que foram excluidos
            let results = await db.query(`SELECT * FROM recipe_files WHERE file_id = $1`,[id])
            //Rodar um delete do recipe_files e do files usando map
            const files = results.rows.map(async file =>{
                await db.query("DELETE FROM recipe_files WHERE file_id = $1",[file.file_id])
            })

            
            await Promise.all(files)
            
            results = await db.query("SELECT * FROM files WHERE id = $1",[id])
            results.rows.map(async file =>{
                try {
                    fs.unlinkSync(file.path)
                } catch (err) {
                    console.error(err)
                }
            })

            return db.query(`DELETE FROM files WHERE id = $1`,[id])
        }
        catch(err){
            console.error(err)
        }   
    },
    async deleteFiles(id){
        try{
            return db.query(`DELETE FROM files WHERE id = $1`,[id])
        }
        catch(err){
            console.error(err)
        }
    },
    async deleteChefFiles(id){
        try{
            //Pegar os files que foram excluidos
            let results = await db.query(`SELECT * FROM chef_files WHERE file_id = $1`,[id])
            //Rodar um delete do recipe_files e do files usando map
            const files = results.rows.map(async file =>{
                await db.query("DELETE FROM chef_files WHERE file_id = $1",[file.file_id])
            })


            await Promise.all(files)

            results = await db.query("SELECT * FROM files WHERE id = $1",[id])
            results.rows.map(async file =>{
                try {
                    fs.unlinkSync(file.path)
                } catch (err) {
                    console.error(err)
                }
            })

            return db.query(`DELETE FROM files WHERE id = $1`,[id])
        } catch(err) {
            console.error(err)
        }   
    }
}