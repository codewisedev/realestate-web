const controller = require('app/http/controllers/controller')

class indexController extends controller {
  async index(req, res) {
    let states = await this.model.State.find()
    let blogs = await this.model.Blog.find({ condition: true })
      .sort({ createdAt: -1 })
      .limit(6)
    const title = 'مشاوره املاک'
    res.render('site', { title, blogs, states })
  }

  async profile(req, res, next) {
    try {
      let myUser = await this.model.User.findOne({
        _id: req.user._id
      }).populate([
        {
          path: 'bookmark',
          options: { sort: { created_at: -1 } },
          populate: [
            {
              path: 'location',
              populate: [
                {
                  path: 'state'
                },
                {
                  path: 'city'
                }
              ]
            },
            {
              path: 'material'
            },
            {
              path: 'price'
            }
          ]
        }
      ])
      res.render('site/profile', { myUser })
    } catch (error) {
      next(error)
    }
  }

  async about(req, res) {
    let about = await this.model.Page.findOne({
      _id: '5f9d03b2fd29614b9c72000c'
    })
    let teams = await this.model.Team.find({})
    const title = 'درباره ما'
    res.render('site/about', { title, about, teams })
  }

  async contact(req, res) {
    const title = 'تماس با ما'
    res.render('site/contact', { title })
  }

  async agent(req, res) {
    let agencies = await this.model.Agent.find({})
    const title = 'لیست املاکی ها'
    res.render('site/agencies', { title, agencies })
  }

  async agentSingle(req, res) {
    const title = 'عنوان املاکی'
    res.render('site/agent', { title })
  }

  async consultant(req, res) {
    let consultants = await this.model.Consultant.find({})
    const title = 'لیست مشاوران'
    res.render('site/consultant', { title, consultants })
  }

  async consultantSingle(req, res) {
    const title = 'نام مشاور'
    res.render('site/consultant-single', { title })
  }

  async faqs(req, res, next) {
    try {
      const title = 'سوالات متداول'
      res.render('site/faqs', { title })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new indexController()
