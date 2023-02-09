//TODO: Drag And Drop JS Code

$(function () {
	$(
		'#sortable1, #sortable2, #sortable3, #sortable4, #sortable5, #sortable6, #sortable7',
	).sortable({
		appendTo: document.body,
		cancel: '.disable-sort-item',
		cursor: 'move',
		opacity: 0.5,
		zIndex: 9999,
		distance: 50,
		items: '> li',
		placeholder: 'sortable-placeholder',
		dropOnEmpty: true,
		forcePlaceholderSize: true,
		tolerance: 'pointer',
		start: function (e, ui) {
			$(ui.placeholder).hide(300);
		},
		stop: async function (e, ui) {
			let parent = $(ui.item).parent();
			let csrf = '<%= req.csrfToken() %>';
			if (parent[0].id == 'sortable7') {
				let id = ui.item[0].id;
				ui.item[0].childNodes.innerHTML = `
					<div class="propertyImg mt-2">
						<form action="/agent/ads/archived/false/${id}?_method=PUT" method="post">
							<input type="hidden" name="_csrf" value="<%= req.csrfToken() %>" />
							<button type="submit" class="btn btn-danger">حذف از آرشیو</button>
						</form>
					</div>
				`;
				const URL = `/agent/ads/archived/true/${id}?_csrf=${csrf}`;
				await fetch(URL, {
					method: 'PUT',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				});
			}
		},
		change: function (e, ui) {
			$(ui.placeholder).hide().show(300);
		},
	});

	$(
		'#sortable1, #sortable2, #sortable3, #sortable4, #sortable5, #sortable6',
	).sortable({
		connectWith: '.connectedSortable',
		remove: function (event, ui) {
			$(ui.item).addClass('ui-card-seven', 500, 'easeOutSine');
		},
	});
});
//! *****************************
