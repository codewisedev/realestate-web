const controller = require('app/http/controllers/controller')
const request = require('request')

class customerController extends controller {
  async index(req, res, next) {
    try {
      let agent = await this.model.Agent.findOne({
        user: req.user
      }).populate({
        path: 'consultant',
        populate: [
          {
            path: 'user'
          }
        ]
      })
      const title = 'لیست مشاوران'
      res.render('agent/consultant', { title, agent })
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      const title = 'مشاور جدید'
      res.render('agent/consultant/create', { title })
    } catch (error) {
      next(error)
    }
  }

  async sendCode(req, res, next) {
    try {
      let mobile = this.trimSpace(req.body.mobile)
      let user = await this.model.User.findOne({ mobile })
      if (!user) {
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
        return res.json(true)
      } else {
        return res.json(false)
      }
    } catch (error) {
      next(error)
    }
  }

  async verify(req, res) {
    try {
      let mobile = this.trimSpace(req.body.mobile)
      let code = req.body.code
      let activeCode = await this.model.ActiveCode.find({ mobile: mobile })
        .gt('expire', new Date())
        .sort({ createdAt: -1 })
      if (activeCode.length > 0 && code == activeCode[0].code) {
        await activeCode[0].updateOne({
          $set: { use: true }
        })
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

  async register(req, res, next) {
    try {
      let mobile = this.trimSpace(req.query.mobile)
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
        res.render('agent/consultant/register', {
          title,
          mobile,
          code,
          states
        })
      } else {
        next()
      }
    } catch (error) {
      next(error)
    }
  }

  async store(req, res, next) {
    try {
      let mobile = req.body.mobile
      let code = req.body.code
      let verify = await this.model.ActiveCode.findOne({
        mobile: mobile,
        code: code,
        use: true
      })
      if (verify) {
        let { mobile, avatar, name, state, city, gender } = req.body
        let password = '@Dr' + mobile
        const newUser = new this.model.User({
          name,
          mobile,
          password,
          avatar,
          consultant: true,
          agent: true
        })
        newUser.$set({ password: newUser.hashPassword(password) })
        await newUser.save().then((user) => {
          const newLoc = new this.model.Location({
            state,
            city
          })
          newLoc.save().then(async (location) => {
            let agent = await this.model.Agent.findOne({ user: req.user._id })
            new this.model.Consultant({
              user,
              agent,
              location,
              forAgent: true,
              gender
            })
              .save()
              .then(async (consultant) => {
                await agent.update({ $push: { consultant } })
              })
          })
        })
        return res.redirect('/agent/consultant')
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new customerController()
