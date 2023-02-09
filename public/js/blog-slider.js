$(document).ready(function () {
	var zindex = 10;
	$('.card-title').click(function (e) {
		e.preventDefault();

		var isShowing = false;

		if ($(this).parent().hasClass('show')) isShowing = true;

		if ($('div.cards').hasClass('showing')) {
			$('div.card.show').removeClass('show');
			if (isShowing) $('div.cards').removeClass('showing');
			else $(this).parent().css({ zIndex: zindex }).addClass('show');
			zindex++;
		} else {
			$('div.cards').addClass('showing');
			$(this).parent().css({ zIndex: zindex }).addClass('show');
			zindex++;
		}
	});
});

var descMaxLen = 300;
var desc = $('.card-description');
for (var i in desc) {
	if (desc[i].innerHTML.length > descMaxLen) {
		desc[i].innerHTML = desc[i].innerHTML.substr(0, descMaxLen) + '...';
	}
}
