const controller = require('app/http/controllers/controller')
const request = require('request')
const os = require('os')
const dns = require('dns')
const macaddress = require('macaddress')

class userController extends controller {
  createCode() {
    return Math.floor(1000 + Math.random() * 9000)
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

  //*Todo: Send Code by SMS
  async sendCode(req, res, next) {
    try {
      let mobile = this.trimSpace(req.body.mobile)
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
      res.json({
        result: true,
        msg: 'کد تایید ارسال شد'
      })
    } catch (error) {
      next(error)
    }
  }

  async validation(req, res, next) {
    //*Todo: Check User Validation
    try {
      let mobile = this.trimSpace(req.body.mobile)
      let code = this.trimSpace(req.body.code)
      let activeCode = await this.model.ActiveCode.find({ mobile: mobile })
        .gt('expire', new Date())
        .sort({ createdAt: -1 })
      let user = await this.model.User.findOne({ mobile: mobile })
      if (activeCode.length > 0 && code == activeCode[0].code) {
        await activeCode[0].updateOne({
          $set: { use: true }
        })
        if (!user)
          return res.json({
            success: true,
            registered: false,
            msg: 'اهراز هویت با موفقیت انجام شد'
          })
        else
          return res.json({
            success: true,
            registered: true,
            user: user._id,
            msg: 'اهراز هویت با موفقیت انجام شد'
          })
      }

      return res.json({
        success: false,
        msg: 'عملیات ناموفق'
      })
    } catch (error) {
      next(error)
    }
  }

  createRefCode(mobile) {
    let code = Math.floor(1000 + Math.random() * 9000)
    return 'DRT' + code + mobile
  }

  async registerAgent(req, res, next) {
    try {
      let {
        address,
        city,
        tell,
        mobile,
        title,
        password,
        lat,
        name,
        lon,
        state,
        region,
        email
      } = req.body

      const newUser = new this.model.User({
        name,
        email,
        mobile,
        password,
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
            logo: req.file
              ? this.imageResize(req.file, [1080, 720, 480], true)
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

        return res.json({
          success: true,
          user_id: user._id
        })
      })
    } catch (error) {
      next(error)
    }
  }

  async registerConsultant(req, res, next) {
    try {
      let { mobile, region, name, email, state, city, address, password } =
        req.body

      const newUser = new this.model.User({
        name,
        email,
        mobile,
        password,
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
          region,
          address
        })

        newLoc.save().then((location) => {
          new this.model.Consoltant({
            user: user._id,
            location
          }).save()
        })

        return res.json({
          success: true,
          user_id: user._id
        })
      })
    } catch (error) {
      next(error)
    }
  }

  async getUser(req, res, next) {
    try {
      let id = req.body.user_id
      let user = await this.model.Agent.findOne({ user: id })
        .populate('user')
        .populate('location')
        .populate('agentValid')
        .exec()
      return res.json({ data: user })
    } catch (error) {
      next(error)
    }
  }

  async update(req, res) {}

  async getState(req, res, next) {
    try {
      let states = await this.model.State.find({})
      return res.json(states)
    } catch (error) {
      next(error)
    }
  }

  async getCity(req, res, next) {
    try {
      let stateId = req.body[0].state
      let cities = await this.model.City.find({ state: stateId })
      return res.json(cities)
    } catch (error) {
      next(error)
    }
  }

  async getRegion(req, res, next) {
    try {
      let cityId = req.body[0].city
      let regions = await this.model.Region.find({ city: cityId })
      return res.json(regions)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new userController()
