const { hash } = require("bcryptjs")
const mailer = require("../../lib/mailer")
const crypto = require("crypto")
const User = require("../models/User")
module.exports = {
    async loginForm(req, res) {
        try {
            const userToken = await User.findOne({ WHERE: { login_token: req.query.token } })
            if (userToken) {
                let now = new Date()
                now = now.setHours(now.getHours())
                if (now > userToken.login_token_expires) {
                    return res.render("admin/session/login", {
                        error: "Token Expirado! Por favor, tente fazer login normalmente"
                    })
                }
                req.session.userId = userToken.id
                return res.redirect("/profile")
            }

            return res.render("admin/session/login")
        } catch (err) {
            console.error(err)
        }

    },
    async login(req, res) {
        req.session.userId = req.user.id
        return res.redirect("/admin/recipes")

    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect("/")
    },
    forgotForm(req, res) {
        return res.render("admin/session/forgot-password")
    },
    async forgot(req, res) {
        try {
            const user = req.user
            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })
            await mailer.sendMail({
                to: user.email,
                from: `no-reply@FoodFy.com.br`,
                subject: `Recuperação de Senha`,
                html: `
                    <h2>Esqueceu a senha?</h2>
                    <p>Não se preocupe,clique no link abaixo para redefinir sua senha.</p>
                    <p><a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">Redefinir Senha</a></p>
                `
            })

            return res.render("admin/session/login", {
                sucess: "Verifique seu email para recuperar sua senha."
            })
        } catch (err) {
            console.error(err)
            return res.render("admin/session/login", {
                error: "Erro ao tentar recuperar sua senha.Tente novamente!"
            })
        }

    },
    resetForm(req, res) {
        return res.render("admin/session/reset-form", { token: req.query.token })
    },
    async reset(req, res) {
        try {
            const user = req.user
            const { password } = req.body

            const newPassword = await hash(password, 8)

            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            return res.render("admin/session/login", {
                sucess: "A senha foi atualizada com sucesso."
            })

        } catch (err) {
            console.error(err)
            return res.render("admin/session/reset-form", {
                user: req.body,
                token,
                error: "Ocorreu um erro inesperado. Por favor,tente novamente!"
            })
        }
    }

}