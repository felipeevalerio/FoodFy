const User = require("../models/User")
const { compare } = require("bcryptjs")

function checkAllFields(body) {
    const keys = Object.keys(body)
    for (let key of keys) {
        if (body[key] == "!")
            return res.render("admin/users/index", {
                error: "Por favor,preencha todos os campos!",
                user: body
            })
    }
}

module.exports = {
    async register(req, res, next) {
        //check if has all fields
        const fillAllFields = checkAllFields(req.body)
        if (fillAllFields)
            return res.render("admin/session/register", fillAllFields)
        //check if user exists

        const { email, password, passwordRepeat } = req.body
        const user = await User.findOne({ where: { email } })

        if (user)
            return res.render("admin/session/register", {
                error: "Usuário já cadastrado",
                user: req.body

            })

        //check if password match
        if (password != passwordRepeat)
            return res.render("admin/session/register", {
                user: req.body,
                error: "As senhas não coincidem"
            })

        next()
    },
    async index(req, res, next) {
        const { userId: id } = req.session

        const user = await User.findOne({ WHERE: { id } })
        if (!user)
            return res.render("admin/session/login", {
                error: "Usuário não cadastrado"
            })

        req.user = user
        next()
    },
    async put(req, res, next) {
        //all fields    
        const fillAllFields = checkAllFields(req.body)
        if (fillAllFields)
            return res.render("admin/users/index", fillAllFields)
        //has password  
        const { id, password } = req.body

        if (!password)
            return res.render("admin/users/index", {
                user: req.body,
                error: "Coloque sua senha pra atualizar seu cadastro"
            })

        const user = await User.findOne({ where: { id } })
        const passed = await compare(password, user.password)
        if (!passed)
            return res.render("admin/users/index", {
                user: user,
                error: "Senha incorreta"
            })

        req.user = user
        next()
        //password match
    },
    async login(req, res, next) {
        const { email, password } = req.body
        //Achar se o usuário existe
        const user = await User.findOne({ WHERE: { email } })
        if (!user) return res.render("admin/session/login", {
            user: req.body,
            error: "Usuário não cadastrado"
        })
        //Comparar senha de usuário
        const passed = await compare(password, user.password)
        if (!passed) return res.render("admin/session/login", {
            user: req.body,
            error: "Senha incorreta"
        })

        req.user = user
        next()
    },
    async forgot(req, res, next) {
        const { email } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) return res.render("admin/session/forgot-password", {
            error: "Usuário não cadastrado"
        })

        req.user = user
        next()
    },
    async reset(req, res, next) {
        const { email, password, passwordRepeat, token } = req.body

        const user = await User.findOne({ WHERE: { email } })
        if (!user) return res.render("admin/session/reset-form", {
            user: req.body,
            token,
            error: "Usuário não encontrado"
        })

        if (password !== passwordRepeat)
            return res.render("admin/session/reset-form", {
                user: req.body,
                token,
                error: "As duas senhas não coincidem"
            })

        if (token !== user.reset_token)
            return res.render("admin/session/reset-form", {
                user: req.body,
                token,
                error: "Token Inválido! Solicite uma nova requisição de senha"
            })

        let now = new Date()
        now = now.setHours(now.getHours())
        if (now > user.reset_token_expires)
            return res.render("admin/session/reset-form", {
                user: req.body,
                token,
                error: "Token expirado! Solicite uma nova requisição de senha"
            })

        req.user = user

        next()
    }
}           