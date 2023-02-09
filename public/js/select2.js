//TODO: Select2 Config

$('.select').select2({
	width: '100%',
	language: {
		noResults: function () {
			return 'موردی پیدا نشد';
		},
	},
	escapeMarkup: function (markup) {
		return markup;
	},
});
//! *****************************
