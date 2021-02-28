const User = require("../models/User")
module.exports = {
    async index(req,res){
        try{
            const {user} = req
            return res.render("admin/users/index",{user})
    
        }catch(err){
            console.error(err)
        }
    },
    async put(req,res){
        try{
            const {user} = req
            let {name,email} = req.body
            await User.update(user.id,{
                name,
                email
            })

            return res.render("admin/users/index",{
                sucess:"Conta atualizada com sucesso",
                user:req.body
            })
        }
        catch(err){
            console.error(err)
            return res.render("admin/users/index",{
                error:"Erro inesperado. Tente novamente!"
            })
        }
    }
}