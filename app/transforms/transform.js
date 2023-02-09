const moment = require('moment-jalaali');
moment.loadPersian({ usePersianDigits: true });

module.exports = class transform {
	transformCollection(items) {
		return items.map(this.transform.bind(this));
	}

	date(time) {
		return moment(time).format('jD jMMMM jYYYY');
	}
};
