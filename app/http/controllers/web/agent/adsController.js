const controller = require('app/http/controllers/controller');
const fs = require('fs');

class adsController extends controller {
	async index(req, res, next) {
		try {
			let advertisings;
			if (req.user.agent) {
				let agent = await this.model.Agent.findOne({
					user: req.user._id,
				});
				advertisings = await this.model.Advertising.find({ agent: agent._id });
			} else {
				advertisings = await this.model.Advertising.find({
					user: req.user._id,
				});
			}
			const title = 'لیست آگهی های من';
			res.render('agent/ads', { title, advertisings });
		} catch (error) {
			next(error);
		}
	}

	async mark(req, res, next) {
		try {
			let advertisings = await this.model.Advertising.find({
				_id: { $in: req.user.bookmark },
			});
			const title = 'آگهی های نشان شده';
			res.render('agent/ads/mark', { title, advertisings });
		} catch (error) {
			next(error);
		}
	}

	async create(req, res, next) {
		try {
			let states = await this.model.State.find();
			const title = 'آگهی جدید';
			res.render('agent/ads/create', { title, states });
		} catch (error) {
			next(error);
		}
	}

	async edit(req, res, next) {
		try {
			let states = await this.model.State.find();
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
			const title = 'ویرایش آگهی';
			res.render('agent/ads/edit', { title, states, ads });
		} catch (error) {
			next(error);
		}
	}

	async destroy(req, res, next) {
		try {
			let ads = await this.model.Advertising.findById(req.params.id);
			if (!ads) this.error('چنین ملکی وجود ندارد', 404);
			//Todo: Delete Images
			Object.values(ads.images).forEach((image) =>
				fs.unlinkSync(`./public${image}`),
			);
			let location = await this.model.Location.findById(ads.location);
			let material = await this.model.Material.findById(ads.material);
			let price = await this.model.Price.findById(ads.price);
			//Todo: Delete Ads
			location.remove();
			material.remove();
			price.remove();
			ads.remove();
			this.toast(req, {
				text: 'آگهی انتخابی حذف شد',
				iconClass: 'toast-error',
			});
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	async privateTrue(req, res, next) {
		try {
			await this.model.Advertising.findByIdAndUpdate(req.params.id, {
				$set: { priv: true },
			});
			this.toast(req, {
				text: 'آگهی انتخابی خصوصی شد',
				iconClass: 'toast-error',
			});
			return this.back(req, res);
		} catch (error) {
			next(error);
		}
	}

	async privateFalse(req, res, next) {
		try {
			await this.model.Advertising.findByIdAndUpdate(req.params.id, {
				$set: { priv: false },
			});
			this.toast(req, {
				text: 'آگهی انتخابی عمومی شد',
				iconClass: 'toast-success',
			});
			return this.back(req, res);
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

	async update(req, res, next) {
		try {
			let {
				state,
				city,
				address,
				region,
				lat,
				lon,
				possibilities,
				heatingCooling,
				adsType,
				transactionType,
				title,
				priv,
				ownerName,
				ownerMobile,
				ownerTell,
				desc,
				privateDesc,
				cooperation,
				cooperateDesc,
				isEmpty,
				price,
				rent,
				exchangeable,
				loan,
				installment,
				exchange,
				deliveredMonth,
				deliveredYear,
				age,
				width,
				height,
				breadth,
				length,
				landArea,
				infrastructureArea,
				modifiedArea,
				doc,
				dengue,
				position,
				floor,
				floorCount,
				unitPerFloor,
				unitType,
				unitCount,
				density,
				constructionPermit,
				businessPermit,
				suitableFor,
				front,
				cabinet,
				flooring,
				oneBedUnitCount,
				twoBedUnitCount,
				threeBedUnitCount,
				suiteCount,
				bedCount,
				bedroomCount,
				bathCount,
				showerCount,
				parkingCount,
				treeCount,
				wallCovering,
			} = req.body;

			let objForUpdate = {};
			objForUpdate.slug = this.slug(title);

			await this.model.Advertising.findByIdAndUpdate(req.params.id, {
				$set: { ...objForUpdate },
			});
			return res.redirect('/agent/ads');
		} catch (error) {
			next(error);
		}
	}

	async store(req, res, next) {
		try {
			var images = [];
			var imageAddress = [];
			if (req.files) {
				await req.files.forEach((image) => {
					images.push(image);
				});
				await images.forEach((image) => {
					imageAddress.push(this.getImageAddress(image));
				});
			}

			let {
				state,
				city,
				address,
				region,
				lat,
				possibilities,
				heatingCooling,
				lon,
				adsType,
				transactionType,
				title,
				priv,
				ownerName,
				ownerMobile,
				ownerTell,
				desc,
				privateDesc,
				cooperation,
				cooperateDesc,
				isEmpty,
				price,
				rent,
				exchangeable,
				loan,
				installment,
				exchange,
				deliveredMonth,
				deliveredYear,
				age,
				width,
				height,
				breadth,
				length,
				landArea,
				infrastructureArea,
				modifiedArea,
				doc,
				dengue,
				position,
				floor,
				floorCount,
				unitPerFloor,
				unitType,
				unitCount,
				density,
				constructionPermit,
				businessPermit,
				suitableFor,
				front,
				cabinet,
				flooring,
				oneBedUnitCount,
				twoBedUnitCount,
				threeBedUnitCount,
				suiteCount,
				bedCount,
				bedroomCount,
				bathCount,
				showerCount,
				parkingCount,
				treeCount,
				wallCovering,
			} = req.body;

			let possibilitiesObject = [];
			if (possibilities != undefined) {
				if (Array.isArray(possibilities)) {
					possibilities.map((hc) => {
						let str = hc.split('-');
						possibilitiesObject.push({
							id: str[0],
							name: str[1],
						});
					});
				} else {
					let str = possibilities.split('-');
					possibilitiesObject.push({
						id: str[0],
						name: str[1],
					});
				}
			}

			let heatingCoolingObject = [];
			if (heatingCooling != undefined) {
				if (Array.isArray(heatingCooling)) {
					heatingCooling.map((hc) => {
						let str = hc.split('-');
						heatingCoolingObject.push({
							id: str[0],
							name: str[1],
						});
					});
				} else {
					let str = heatingCooling.split('-');
					heatingCoolingObject.push({
						id: str[0],
						name: str[1],
					});
				}
			}

			await new this.model.Location({
				state,
				city,
				region,
				address,
				lat,
				lon,
			})
				.save()
				.then(async (location) => {
					try {
						await new this.model.Price({
							price,
							rent,
							exchangeable: exchangeable == 'on' ? false : true,
							loan,
							installment,
							exchange,
							deliveredMonth,
							deliveredYear,
						})
							.save()
							.then(async (price) => {
								await new this.model.Material({
									age,
									width,
									height,
									breadth,
									length,
									landArea,
									infrastructureArea,
									modifiedArea,
									doc,
									dengue,
									position,
									floor,
									floorCount,
									unitPerFloor,
									unitType,
									unitCount,
									density,
									constructionPermit,
									businessPermit,
									suitableFor,
									front,
									cabinet,
									flooring,
									oneBedUnitCount,
									twoBedUnitCount,
									threeBedUnitCount,
									suiteCount,
									bedCount,
									bedroomCount,
									bathCount,
									showerCount,
									parkingCount,
									treeCount,
									wallCovering,
								})
									.save()
									.then(async (material) => {
										var agent;
										if (req.user.consultant) {
											var consultant = await this.model.Consultant.findOne({
												user: req.user._id,
											});
											if (consultant.forAgent) {
												agent = await this.model.Agent.findOne({
													_id: consultant.agent,
												});
											} else {
												agent = null;
											}
										} else {
											agent = await this.model.Agent.findOne({
												user: req.user._id,
											});
										}

										await new this.model.Advertising({
											user: req.user._id,
											agent: agent._id,
											priv: priv == 'on' ? true : false,
											title,
											slug: this.slug(title),
											images: imageAddress,
											transactionType,
											adsType,
											isEmpty,
											ownerName,
											ownerMobile,
											ownerTell,
											desc,
											privateDesc,
											cooperation: cooperation == 'on' ? true : false,
											cooperateDesc,
											location,
											possibilities: possibilitiesObject,
											heatingCooling: heatingCoolingObject,
											material,
											price,
										}).save();
									});
							});
					} catch (error) {
						next(error);
					}
				});

			return res.redirect('/agent/ads');
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new adsController();
