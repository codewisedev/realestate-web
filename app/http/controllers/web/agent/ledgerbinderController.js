const controller = require('app/http/controllers/controller');

class ledgerbinderController extends controller {
	async index(req, res, next) {
		try {
			let advertisings = await this.model.Advertising.find({
				user: req.user,
			})
				.populate([
					{
						path: 'location',
						populate: [
							{
								path: 'state',
							},
							{
								path: 'city',
							},
							{
								path: 'region',
							},
						],
					},
					{
						path: 'user',
					},
					{
						path: 'price',
					},
					{
						path: 'material',
					},
				])
				.exec();
			const title = 'کلاسور املاک';
			res.render('agent/ads/ledgerbinder', { title, advertisings });
		} catch (error) {
			next(error);
		}
	}

	async archiveTrue(req, res, next) {
		try {
			await this.model.Advertising.findByIdAndUpdate(req.params.id, {
				$set: { archived: true },
			});
		} catch (error) {
			next(error);
		}
	}

	async archiveFalse(req, res, next) {
		try {
			await this.model.Advertising.findByIdAndUpdate(req.params.id, {
				$set: { archived: false },
			});
			res.redirect('/agent/ads/ledgerbinder');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new ledgerbinderController();
