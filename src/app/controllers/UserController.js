const User = require("../models/User")
const mailer = require("../../lib/mailer")
const crypto = require("crypto")
const { hash } = require("bcryptjs")

function checkAllFields(body) {
    const keys = Object.keys(body)
    for (let key of keys) {
        if (body[key] == "")
            return true
    }
}


module.exports = {
    registerForm(req, res) {
        return res.render("admin/session/register")
    },
    async register(req, res) {
        try {
            const allFields = checkAllFields()
            if(allFields)
                return res.render("admin/session/register",{
                    user:req.body,
                    error:"Por favor,preencha todos os campos"
                })
            const { name, email, password } = req.body
            
            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            const newPassword = await hash(password, 8)

            const userId = await User.create({
                name,
                email,
                password: newPassword,
                login_token: token,
                login_token_expires: now
            })

            const user = await User.findOne({ where: { id: userId } })

            await mailer.sendMail({
                to: user.email,
                from: "no-reply@FoodFy.com.br",
                subject: "Cadastro FoodFy",
                html: `
                <h2>${user.name}, Seja bem vindo ao FoodFy!</h2>
                <p>Clique no link abaixo para entrar na sua conta</p>
                <p><a href="http://localhost:3000/users/login?token=${token}" target="_blank">Entrar Agora!</a></p>
                `
            })
            return res.render("admin/session/login", {
                sucess: "Verifique seu email para entrar na sua conta!"
            })
        } catch (err) {
            console.error(err)
            return res.render("admin/session/register", {
                error: "Ocorreu um erro inesperado.Por favor,tente novamente!"
            })
        }


    },
    async list(req, res) {
        try {
            const { userId } = req.session
            const users = await User.findAll()
            return res.render("admin/users/list", { items: users, userId })
        } catch (err) {
            console.error(err)
        }
    },
    adminCreate(req, res) {
        return res.render("admin/users/admin-create")
    },
    async post(req, res) {

        try {
            const allFields = checkAllFields(req.body)
            if(allFields)
                return res.render("admin/users/admin-create", {
                    user:req.body,
                    error: "Por favor,preencha todos os campos!"
                })
            
            const { name, email, is_admin } = req.body

            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 3)

            const userId = await User.create({
                name,
                email,
                is_admin: is_admin || false,
                password: 1234,
                reset_token: token,
                reset_token_expires: now
            })
            const user = await User.findOne({ WHERE: { id: userId } })
            await mailer.sendMail({
                to: user.email,
                from: "no-reply@FoodFy.com.br",
                subject: "Cadastro FoodFy",
                html: `
                <h2>${user.name}, Seja bem vindo ao FoodFy!</h2>
                <p>Clique no link abaixo para acessar sua conta e trocar de senha.</p>
                <p>Sua senha padrão é ${user.password}</p>
                <p><a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">Entrar Agora!</a></p>
                `
            })
            return res.render(`admin/users/admin-edit`, {
                sucess: "Usuário cadastrado com sucesso",
                user
            })
        } catch (err) {
            const user = await User.findOne({ WHERE: { id: req.body.id } })
            return res.render("admin/users/admin-create", {
                user,
                error: "Erro ao tentar criar usuário. Por favor,tente novamente!"
            })
        }

    },
    async findUser(req, res) {
        try {
            const user = await User.findOne({ WHERE: { id: req.params.id } })
            return res.render("admin/users/admin-edit", { user })
        } catch (err) {
            console.error(err)
        }

    },
    async put(req, res) {
        try {
            const user = await User.findOne({ WHERE: { id: req.body.id } })
            let { name, email, is_admin } = req.body
            if (!is_admin) is_admin = false

            await User.update(user.id, {
                name,
                email,
                is_admin
            })
            return res.render("admin/users/admin-edit", {
                sucess: "Conta atualizada com sucesso",
                user: req.body
            })
        } catch (err) {
            console.error(err)
            const user = await User.findOne({ WHERE: { id: req.body.id } })
            return res.render("admin/users/admin-edit", {
                user,
                error: "Erro ao tentar editar usuário. Por favor,tente novamente!"
            })
        }

    },
    async delete(req, res) {
        const { userId } = req.session
        await User.delete(req.body.id)
        const users = await User.findAll()
        return res.render("admin/users/list", {
            items: users,
            sucess: "Usuário deletado com sucesso", userId
        })
    }

}