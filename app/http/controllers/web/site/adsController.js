const controller = require('app/http/controllers/controller');

class adsController extends controller {
	async index(req, res, next) {
		try {
			let advertisings = await this.getAds(req, res, next);
			const title = 'لیست آگهی ها';
			res.render('site/ads-search', { title, advertisings });
		} catch (error) {
			next(error);
		}
	}

	async moreAds(req, res, next) {
		try {
			let advertisings = await this.getAds(req, res, next);
			return res.json(advertisings);
		} catch (error) {
			next(error);
		}
	}

	async getAds(req, res, next) {
		try {
			let query = {};
			let {
				transactionType,
				state,
				city,
				region,
				minPrice,
				maxPrice,
				minRent,
				maxRent,
				minArea,
				maxArea,
				adsType,
				latlon,
				search,
				possibilities,
				heatingCooling,
			} = req.query;

			if (heatingCooling) {
				if (Array.isArray(heatingCooling))
					query['heatingCooling.id'] = { $in: heatingCooling };
				else query['heatingCooling.id'] = heatingCooling;
			}

			if (possibilities) {
				if (Array.isArray(possibilities))
					query['possibilities.id'] = { $in: possibilities };
				else query['possibilities.id'] = possibilities;
			}

			if (transactionType && transactionType != 'all')
				query.transactionType = transactionType;

			let locationQuery = {};
			if (latlon) {
				latlon = latlon.split('-');
				let lat = latlon[0];
				let lon = latlon[1];
				locationQuery = {
					$and: [
						{
							$or: [
								{ lat: { $gte: lat - 0.01 } },
								{ lat: { $lte: lat + 0.01 } },
							],
						},
						{
							$or: [
								{ lon: { $gte: lon - 0.01 } },
								{ lon: { $lte: lon + 0.01 } },
							],
						},
					],
				};
			}
			if (state && state != 'none') locationQuery.state = state;
			if (city && city != 'none') locationQuery.city = city;
			if (region && region != 'none') locationQuery.region = region;

			let priceQuery = {};
			if (minPrice) priceQuery.price = { $gte: minPrice };
			if (maxPrice) priceQuery.price = { $lte: maxPrice };
			if (maxPrice && minPrice)
				priceQuery = {
					$and: [
						{
							price: { $gte: minPrice },
						},
						{
							price: { $lte: maxPrice },
						},
					],
				};

			let rentQuery = {};
			if (minRent) rentQuery.rent = { $gte: minRent };
			if (maxRent) rentQuery.rent = { $lte: maxRent };
			if (maxRent && minRent)
				rentQuery = {
					$and: [
						{
							rent: { $gte: minRent },
						},
						{
							rent: { $lte: maxRent },
						},
					],
				};

			let areaQuery = {};
			if (minArea) areaQuery.area = { $gte: minArea };
			if (maxArea) areaQuery.area = { $lte: maxArea };
			if (minArea && maxArea)
				areaQuery = {
					$and: [
						{
							area: { $gte: minArea },
						},
						{
							area: { $lte: maxArea },
						},
					],
				};

			if (adsType && adsType != 'all') query.adsType = adsType;

			if (search) query.title = new RegExp(search, 'gi');

			let page = req.body.page - 1 || 0;
			let skip = page * 10;
			let advertisings = await this.model.Advertising.find({
				...query,
				...priceQuery,
				...areaQuery,
			})
				.populate([
					{
						path: 'location',
						match: {
							...locationQuery,
						},
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
				.skip(skip)
				.limit(3)
				.exec();
			if (req.query.order) advertisings.sort({ createdAt: -1 });
			return advertisings;
		} catch (error) {
			next(error);
		}
	}

	async single(req, res, next) {
		try {
			let ads = await this.model.Advertising.findOne({ _id: req.params.id })
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
			const title = ads.slug;
			res.render('site/ads', { title, ads });
		} catch (error) {
			next(error);
		}
	}

	async getCity(req, res, next) {
		try {
			let steteId = await req.body.id;
			let cities = await this.model.City.find({ state: steteId });
			return res.json(cities);
		} catch (error) {
			next(error);
		}
	}

	async getRegion(req, res, next) {
		try {
			let cityId = await req.body.id;
			let regions = await this.model.Region.find({ city: cityId });
			return res.json(regions);
		} catch (error) {
			next(error);
		}
	}

	async bookmarkFalse(req, res, next) {
		try {
			await req.user.update({ $pull: { bookmark: req.body.id } });
			return;
		} catch (error) {
			next(error);
		}
	}

	async bookmarkTrue(req, res, next) {
		try {
			await req.user.update({ $push: { bookmark: req.body.id } });
			return;
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new adsController();
