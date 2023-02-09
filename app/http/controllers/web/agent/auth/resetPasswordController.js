const controller = require('app/http/controllers/controller')
const request = require('request')
const url = require('url')

class resetPasswordController extends controller {
  showForgotPassword(req, res, next) {
    try {
      const title = 'فراموشی رمز عبور'
      res.render('auth/agent/reset-password/sendCode', {
        recaptcha: this.recaptcha.render(),
        title
      })
    } catch (error) {
      next(error)
    }
  }

  showResetPassword(req, res, next) {
    try {
      const title = 'بازیابی رمز عبور'
      res.render('auth/agent/reset-password/reset', {
        recaptcha: this.recaptcha.render(),
        title
      })
    } catch (error) {
      next(error)
    }
  }

  async sendPasswordResetCode(req, res, next) {
    try {
      await this.recaptchaValidation(req, res)
      let result = await this.validationData(req)
      if (result) return this.sendResetCode(req, res)
    } catch (error) {
      next(error)
    }
  }

  async activationCode(mobile) {
    let code = await this.createCode().toString()
    let newActiveCode = new this.model.ActiveCode({
      mobile,
      code,
      expire: Date.now() + 1000 * 60 * 5
    })
    await newActiveCode.save()
    return code
  }

  createCode() {
    return Math.floor(1000 + Math.random() * 9000)
  }

  async sendResetCode(req, res, next) {
    try {
      let mobile = this.trimSpace(req.body.mobile)
      let user = await this.model.User.findOne({ mobile })
      if (user) {
        let mobile = await this.trimSpace(req.body.mobile)
        let code = await this.activationCode(mobile)
        let options = {
          method: 'POST',
          url: 'http://shahtootpayam.ir/webservice/rest/sms_send',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: 'PHPSESSID=jf3a8gle1155s76hs9sbohr393'
          },
          form: {
            login_username: 'reyhani',
            login_password: '09190493506r',
            receiver_number: mobile,
            'note_arr[]': `کد تایید شما در مشاوره املاک: ${code}`,
            sender_number: '5000246064'
          }
        }
        await request(options, function (error, response) {
          if (error) throw new Error(error)
        })

        res.redirect(
          url.format({
            pathname: '/auth/agent/password/reset/token',
            query: {
              mobile: req.body.mobile
            }
          })
        )
      } else {
        req.flash('errors', 'چنین کاربری وجود ندارد!')
        return res.redirect(req.originalUrl)
      }
    } catch (error) {
      next(error)
    }
  }

  async resetPasswordProccess(req, res, next) {
    try {
      await this.recaptchaValidation(req, res)
      let result = await this.validationData(req)
      if (result) return this.resetPassword(req, res)
      return this.back(req, res)
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req, res, next) {
    try {
      let mobile = req.query.mobile
      let code = req.body.code
      let activeCode = await this.model.ActiveCode.find({ mobile })
        .gt('expire', new Date())
        .sort({ createdAt: -1 })
      if (activeCode.length > 0 && code == activeCode[0].code) {
        try {
          await activeCode[0].updateOne({
            $set: { use: true }
          })
        } catch (error) {
          console.log(error)
        }
        let user = await this.model.User.findOne({ mobile })
        if (!user) {
          req.flas('errors', 'چنین کاربری پیدا نشد')
          return this.back()
        } else {
          user.$set({ password: user.hashPassword(req.body.password) })
          await user.save()
        }
        return res.redirect('/auth/agent')
      }
      req.flas('errors', 'کد وارد شده صحیح نمی باشد')
      return this.back()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new resetPasswordController()
