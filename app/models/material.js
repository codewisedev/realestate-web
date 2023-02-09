const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialSchema = Schema(
	{
		age: { type: Number, required: false },
		width: { type: Number, required: false },
		height: { type: Number, required: false },
		breadth: { type: Number, required: false },
		length: { type: Number, required: false },
		landArea: { type: Number, required: false },
		infrastructureArea: { type: Number, required: false },
		modifiedArea: { type: Number, required: false },
		doc: { type: Number, required: false },
		dengue: { type: Number, required: false },
		position: { type: Number, required: false },
		floor: { type: Number, required: false },
		floorCount: { type: Number, required: false },
		unitPerFloor: { type: Number, required: false },
		unitType: { type: Number, required: false },
		unitCount: { type: Number, required: false },
		density: { type: Number, required: false },
		constructionPermit: { type: Boolean, required: false },
		businessPermit: { type: Boolean, required: false },
		suitableFor: { type: String, required: false },
		front: { type: Number, required: false },
		cabinet: { type: Number, required: false },
		flooring: { type: Number, required: false },
		oneBedUnitCount: { type: Number, required: false },
		twoBedUnitCount: { type: Number, required: false },
		threeBedUnitCount: { type: Number, required: false },
		suiteCount: { type: Number, required: false },
		bedCount: { type: Number, required: false },
		bedroomCount: { type: Number, required: false },
		bathCount: { type: Number, required: false },
		showerCount: { type: Number, required: false },
		parkingCount: { type: Number, required: false },
		treeCount: { type: Number, required: false },
		wallCovering: { type: Number, required: false },
	},
	{ timestamps: { updatedAt: false } },
);

module.exports = mongoose.model('material', materialSchema);
