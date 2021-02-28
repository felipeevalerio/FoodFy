const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "be2b6e30048f01",
    pass: "25d5752128d1cd"
  }
});