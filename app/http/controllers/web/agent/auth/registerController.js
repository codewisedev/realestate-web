const controller = require('app/http/controllers/controller')
const request = require('request')
const url = require('url')
const fs = require('fs')
const os = require('os')
const dns = require('dns')
const macaddress = require('macaddress')

class registerController extends controller {
  async showRegsitrationForm(req, res, next) {
    try {
      let mobile = req.query.mobile
      let code =
        req.query.code1 + req.query.code2 + req.query.code3 + req.query.code4
      let activeCode = await this.model.ActiveCode.findOne({
        mobile,
        code,
        use: true
      }).sort({ createdAt: -1 })
      if (activeCode) {
        let states = await this.model.State.find()
        const mobile = this.trimSpace(req.query.mobile)
        const title = 'مشاوره املاک'
        if (req.query.type == '1') {
          res.render('auth/agent/register-agent', {
            title,
            mobile,
            code,
            states
          })
        } else {
          res.render('auth/agent/register-consultant', {
            title,
            mobile,
            code,
            states
          })
        }
      } else {
        this.alertAndBack(req, res, {
          title: 'اخطار',
          text: 'شما اجازه ی ثبت نام ندارید'
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getCity(req, res, next) {
    try {
      let steteId = await req.body.id
      let cities = await this.model.City.find({ state: steteId })
      return res.json(cities)
    } catch (error) {
      next(error)
    }
  }

  async getRegion(req, res, next) {
    try {
      let cityId = await req.body.id
      let regions = await this.model.Region.find({ city: cityId })
      return res.json(regions)
    } catch (error) {
      next(error)
    }
  }

  async showVerifyForm(req, res, next) {
    try {
      const mobile = this.trimSpace(req.query.mobile)
      const type = req.query.type
      const title = 'مشاوره املاک'
      res.render('auth/agent/verify', { title, mobile, type })
    } catch (error) {
      next(error)
    }
  }

  async sendCode(req, res) {
    let mobile = this.trimSpace(req.body.mobile)
    let user = await this.model.User.findOne({ mobile })
    if (!user) {
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
          'note_arr[]': `مشاوره املاکی عزیز، کد تایید شما: ${code}`,
          sender_number: '5000246064'
        }
      }
      await request(options, function (error, response) {
        if (error) throw new Error(error)
      })

      res.redirect(
        url.format({
          pathname: '/auth/agent/verify',
          query: {
            mobile,
            type: req.body.type
          }
        })
      )
    } else {
      req.flash('errors', 'شما قبلا ثبت نام کرده اید!')
      return this.back(req, res)
    }
  }

  async validation(req, res) {
    try {
      let mobile = req.body.mobile
      let code = req.body.code
      let activeCode = await this.model.ActiveCode.find({ mobile: mobile })
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

        return res.json(true)
      }
      return res.json(false)
    } catch (error) {
      res.json(error)
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

  async storeAgent(req, res, next) {
    try {
      let status = await this.validationData(req)
      if (!status) return this.back(req, res)

      let mobile = req.body.mobile
      let code = req.body.code
      let verify = await this.model.ActiveCode.findOne({
        mobile: mobile,
        code: code,
        use: true
      })

      if (verify) {
        let {
          mobile,
          avatar,
          name,
          title,
          email,
          state,
          city,
          region,
          address,
          lat,
          lon,
          tell,
          password
        } = req.body

        const newUser = new this.model.User({
          name,
          email,
          mobile,
          password,
          avatar:
            req.files.profile[0] != undefined
              ? this.getImageAddress(req.files.profile[0])
              : avatar,
          agent: true
        })
        newUser.$set({ password: newUser.hashPassword(password) })

        await newUser.save().then(async (user) => {
          this.registerDevice(req, res, user)

          const newLoc = new this.model.Location({
            state,
            city,
            region,
            address,
            lat,
            lon
          })

          newLoc.save().then((location) => {
            new this.model.Agent({
              user: user._id,
              title,
              slug: this.slug(title),
              logo: req.files.logo[0]
                ? this.imageResize(req.files.logo[0], [1080, 720, 480], true)
                : null,
              tell,
              location,
              ref: this.createRefCode(mobile)
            })
              .save()
              .then(async (agent) => {
                const newAgentValid = new this.model.AgentValid({
                  agent: agent
                })
                await newAgentValid.save().then(async (agentValid) => {
                  await this.model.Agent.updateOne(
                    { _id: agent._id },
                    { agentValid }
                  )
                })
              })
          })
        })

        this.alert(req, {
          title: 'پیام',
          text: 'ثبت نام با موفقیت انجام شد. لطفا وارد شوید',
          icon: 'success',
          button: 'بستن'
        })

        return res.redirect('/auth/agent')
      }
    } catch (error) {
      next(error)
    }
  }

  async storeConsoltant(req, res, next) {
    try {
      let status = await this.validationData(req)

      if (!status) {
        if (req.file) fs.unlinkSync(req.file.path)
        return this.back(req, res)
      }

      let mobile = req.body.mobile
      let code = req.body.code
      let verify = await this.model.ActiveCode.findOne({
        mobile: mobile,
        code: code,
        use: true
      })

      if (verify) {
        let { mobile, avatar, name, email, state, city, address, password } =
          req.body

        const newUser = new this.model.User({
          name,
          email,
          mobile,
          password,
          avatar: req.file ? this.getImageAddress(req.file) : avatar,
          agent: true
        })
        newUser.$set({ password: newUser.hashPassword(password) })

        await newUser.save().then(async (user) => {
          await dns.lookup(os.hostname(), async (err, ip) => {
            if (err) throw err
            let host = os.hostname() + '-' + os.platform()
            let mac = macaddress.one((err, mac) => {
              if (err) throw err
              return mac
            })
            let title = req.device.type.toUpperCase()
            let newDevice = new this.model.Device({
              user: user._id,
              title,
              host,
              ip,
              mac
            })
            newDevice.save().then(async (device) => {
              await user.updateOne({ $set: { firstDevice: device } })
            })
          })

          const newLoc = new this.model.Location({
            state,
            city,
            address
          })

          newLoc.save().then((location) => {
            new this.model.Consoltant({
              user: user._id,
              location
            }).save()
          })
        })

        this.alert(req, {
          title: 'پیام',
          text: 'ثبت نام با موفقیت انجام شد. لطفا وارد شوید',
          icon: 'success',
          button: 'بستن'
        })

        return res.redirect('/auth/agent')
      }
    } catch (error) {
      next(error)
    }
  }

  createRefCode(mobile) {
    let code = Math.floor(1000 + Math.random() * 9000)
    return 'DRT' + code + mobile
  }
}

module.exports = new registerController()
