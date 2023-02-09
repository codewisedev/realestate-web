const controller = require('app/http/controllers/controller')
const fs = require('fs')

class pageController extends controller {
  async aboutPage(req, res, next) {
    try {
      let about = await this.model.Page.findOne({
        _id: '5f9d03b2fd29614b9c72000c'
      })
      const title = 'صفحه درباره ما'
      res.render('admin/setting/page/about', { title, about })
    } catch (error) {
      next(error)
    }
  }

  async storeAbout(req, res, next) {
    try {
      await this.model.Page.findOneAndUpdate(
        { _id: '5f9d03b2fd29614b9c72000c' },
        { $set: { text: req.body.text } }
      )
      req.flash('messages', 'تغییرات با موفقیت ثبت شد')
      return this.back(req, res)
    } catch (error) {
      next(error)
    }
  }

  async teamPage(req, res, next) {
    try {
      let teams = await this.model.Team.find({})
      const title = 'لیست اعضای تیم مشاوره املاک'
      res.render('admin/setting/page/team', { title, teams })
    } catch (error) {
      next(error)
    }
  }

  async createTeam(req, res, next) {
    try {
      const title = 'عضو جدید مشاوره املاک'
      res.render('admin/setting/page/team/create', { title })
    } catch (error) {
      next(error)
    }
  }

  async storeTeam(req, res, next) {
    try {
      new this.model.Team({
        name: req.body.name,
        image: this.imageResize(req.file, [480, 720], false),
        twitter: req.body.twitter,
        instagram: req.body.instagram,
        linkedin: req.body.linkedin
      }).save()
      return res.redirect('/admin/setting/page/team')
    } catch (error) {
      next(error)
    }
  }

  async editTeam(req, res, next) {
    try {
      const title = 'ویرایش عضو'
      let team = await this.model.Team.findById(req.params.id)
      return res.render('admin/setting/page/team/edit', { title, team })
    } catch (error) {
      next(error)
    }
  }

  async updateTeam(req, res, next) {
    try {
      let status = await this.validationData(req)
      if (!status) {
        if (req.file) fs.unlinkSync(req.file.path)
        return this.back(req, res)
      }
      let objForUpdate = {}
      //Todo: Check Image is not empty
      if (req.file)
        objForUpdate.image = this.imageResize(req.file, [480, 720], false)
      delete req.body.image
      await this.model.Team.findByIdAndUpdate(req.params.id, {
        $set: { ...req.body, ...objForUpdate }
      })
      return res.redirect('/admin/setting/page/team')
    } catch (error) {
      next(error)
    }
  }

  async destroyTeam(req, res, next) {
    try {
      let team = await this.model.Team.findById(req.params.id)
      //Todo: Delete Images
      Object.values(team.image).forEach((image) =>
        fs.unlinkSync(`./public${image}`)
      )
      //*Todo: Delete Team
      team.remove()
      return this.back(req, res)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new pageController()
