//TODO: Datatable JS Code

//* Datatables Config
// eslint-disable-next-line no-unused-vars
function datatable(id, order, columnDefs) {
	var table = $(id).DataTable({
		language: {
			paginate: {
				next: 'بعدی',
				previous: 'قبلی',
			},
			lengthMenu: 'نمایش ردیف ها: _MENU_ ',
			sZeroRecords: 'رکوردی یافت نشد',
		},
		autoWidth: true,
		scrollX: true,
		responsive: true,
		paging: true,
		lengthMenu: [5, 10, 25, 50, 75, 100],
		searching: true,
		info: false,
		order: order,
		columnDefs: columnDefs,
	});

	const selectElement = document.getElementById('search');
	selectElement.addEventListener('keydown', (event) => {
		var title = event.target.value;
		table.search(title).draw();
	});
}

//* Search Config
// eslint-disable-next-line no-unused-vars
function searchToggle(obj, evt) {
	var table = $('#table').DataTable();
	var container = $(obj).closest('.search-wrapper');
	if (!container.hasClass('active')) {
		container.addClass('active');
		evt.preventDefault();
	} else if (
		container.hasClass('active') &&
		$(obj).closest('.input-holder').length == 0
	) {
		container.removeClass('active');
		container.find('.search-input').val('');
		table.search('').draw();
	}
}
//! *****************************
