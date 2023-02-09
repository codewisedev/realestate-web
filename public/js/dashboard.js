//TODO: Dashboard Panel

$(function () {
	'use strict';

	Chart.defaults.global.defaultFontFamily = 'Vazir';
	var salesChartCanvas = document.getElementById('salesChart').getContext('2d');
	new Chart(salesChartCanvas, {
		type: 'line',
		data: {
			labels: [
				'فروردین',
				'اردیبهشت',
				'خرداد',
				'تیر',
				'مرداد',
				'شهریور',
				'مهر',
				'آبان',
				'آذر',
				'دی',
				'بهمن',
				'اسفند',
			],
			datasets: [
				{
					label: 'فروش',
					data: [12, 19, 3, 5, 2, 3, 5, 8, 3, 5, 2, 3],
					backgroundColor: 'rgba(40, 167, 69, 0.2)',
					borderColor: 'rgb(1, 98, 87, 1)',
					borderWidth: 1,
				},
			],
		},
		options: {
			maintainAspectRatio: true,
			responsive: true,
		},
	});
});
