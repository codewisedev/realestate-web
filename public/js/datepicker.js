//TODO: Datepicker Config

function age(dateString) {
	var today = new Date();
	var birthDate = new Date(dateString);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
	age < 0 || Number.isNaN(age) ? (age = 0) : age;
	return age;
}

$(document).ready(function () {
	$('#date').pDatepicker({
		observer: true,
		format: 'YYYY/MM/DD',
		altField: '#alt-date',
		autoClose: true,
		initialValue: false,
		maxDate: new persianDate().add('year', 0).valueOf(),
		minDate: new persianDate().subtract('year', 150).valueOf(),
		onSelect: function (birth) {
			$('#age').text(age(birth) + ' سال');
		},
	});
});
//! *****************************
