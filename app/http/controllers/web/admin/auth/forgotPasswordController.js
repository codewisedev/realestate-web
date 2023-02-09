const controller = require('app/http/controllers/controller')
const uniqueString = require('unique-string')
const mail = require('app/helpers/mail')

class forgotPasswordController extends controller {
  showForgotPassword(req, res, next) {
    try {
      const title = 'فراموشی رمز عبور'
      res.render('auth/admin/reset-password/sendCode', {
        recaptcha: this.recaptcha.render(),
        title
      })
    } catch (error) {
      next(error)
    }
  }

  async sendPasswordResetLink(req, res, next) {
    try {
      await this.recaptchaValidation(req, res)
      let result = await this.validationData(req)
      if (result) return this.sendResetLink(req, res)
      return this.back(req, res)
    } catch (error) {
      next(error)
    }
  }

  async sendResetLink(req, res, next) {
    try {
      let user = await this.model.User.findOne({ email: req.body.email })
      if (!user) {
        req.flash('errors', 'چنین کاربری وجود ندارد')
        return this.back(req, res)
      }
      const newPasswordReset = new this.model.PasswordReset({
        email: req.body.email,
        token: uniqueString()
      })
      await newPasswordReset.save()
      let information = {
        from: '"مشاوره املاک" <state@gmail.com>', //Todo: sender address
        to: `${newPasswordReset.email}`, //Todo: list of receivers
        subject: 'بازیابی رمز عبور', //Todo: Subject line
        html: `
					<body>
						<p>جهت فعال سازی حساب کاربریتان بر روی لینک زیر کلیک کنید</p>
						<a href="${config.siteurl}/auth/admin/password/reset/${newPasswordReset.token}"><button type="button">کلیک کنید</button></a>
						<p>Real Estate &copy; 2020</p>
					</body>
            ` //Todo: html body
      }
      mail.sendMail(information, (err, info) => {
        if (err) console.log(err)
        req.flash('messages', 'لینک بازیابی رمز عبور به ایمیل شما ارسال شد')
        return this.back(req, res)
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new forgotPasswordController()
