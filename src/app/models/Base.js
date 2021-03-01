const db = require("../../config/db")

function find(filter,table){
    try{
        let query = `SELECT * FROM ${table}`
        
        if(filter){
            Object.keys(filter).map(key =>{
                query += ` ${key}`
    
                Object.keys(filter[key]).map(field =>{
                    query += ` ${field} = '${filter[key][field]}'`
                })
            })
        }

        return db.query(query)
    }
    catch(err){
        console.error(err)
    }
}


const Base = {
    init({table}){
        if(!table) throw new Error("Invalid Params")

        this.table = table
        return this
    },
    async find(id){
        const results = await find({WHERE:{id}},this.table)
        return results.rows[0]
    },
    async findOne(filter){
        try{
            const results = await find(filter,this.table)
            return results.rows[0]
        }
        catch(err){
            console.error(err)
        }
    },
    async findAll(filter){
        try {
            const results = await find(filter,this.table)
            return results.rows
        } catch (err) {
            console.error(err)
        }
    },
    async create(fields){
        try {

            let keys = [],
                values = []

            Object.keys(fields).map(key =>{
                keys.push(key)
                Array.isArray(fields[key])
                ? values.push(`'{"${fields[key].join('","')}"}'`)
                : values.push(`'${fields[key]}'`);
                    
            })
            
            const query = `
            INSERT INTO ${this.table} (${keys.join(",")}) 
            VALUES(${values.join(',')})
            RETURNING id`
            const results = await db.query(query)
            return results.rows[0].id

        } catch (err) {
            console.error(err)
        }
    },
    update(id,fields){
        try {
            let update = []

            Object.keys(fields).map(key =>{
                const line = `${key} = '${fields[key]}' `
                update.push(line)
            })

            let query = `UPDATE ${this.table} SET 
                ${update.join(",")}
                WHERE id = ${id}
            `
            return db.query(query)

        } catch (err) {
            console.error(err)
        }
        
    },
    delete(id){
        return db.query(`DELETE FROM ${this.table} WHERE id = $1`,[id])
    }
}

module.exports = Base
