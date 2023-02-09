//TODO: Autorization Site JS Code

//* Check Number Input
// eslint-disable-next-line no-unused-vars
function isNumber(evt) {
	evt = evt ? evt : window.event;
	var charCode = evt.which ? evt.which : evt.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	return true;
}
//! *****************************

//* OTP Input
$('.otp')
	.find('input')
	.each(function () {
		$(this).attr('maxlength', 1);
		$(this).on('keyup', function (e) {
			var parent = $($(this).parent());

			if (e.keyCode === 8 || e.keyCode === 37) {
				var prev = parent.find('input#' + $(this).data('previous'));

				if (prev.length) {
					$(prev).select();
				}
			} else if (
				(e.keyCode >= 48 && e.keyCode <= 57) ||
				(e.keyCode >= 65 && e.keyCode <= 90) ||
				(e.keyCode >= 96 && e.keyCode <= 105) ||
				e.keyCode === 39
			) {
				var next = parent.find('input#' + $(this).data('next'));

				if (next.length) {
					$(next).select();
				} else {
					if (parent.data('autosubmit')) {
						parent.submit();
					}
				}
			}
		});
	});
//! *****************************

//* Error Handler
$('#error').hide();
$('#submit').click(async () => {
	let mobile = $('#mobile')
		.val()
		// eslint-disable-next-line no-useless-escape
		.replace(/(\s|\_)/g, '');
	if (mobile.length < 11 || !mobile.match(/^09/))
		$('#error').show().fadeOut(3000);
	else $('#register').submit();
	event.preventDefault();
});
//! *****************************

var register = document.querySelector('#register');
var login = document.querySelector('#login');

document.addEventListener(
	'click',
	function (event) {
		if (event.target.matches('.show')) {
			register.removeAttribute('hidden');
			register.classList.add('flipInY');
			login.setAttribute('hidden', 'true');
			login.classList.remove('flipInY');
		}

		if (event.target.matches('.hide')) {
			register.setAttribute('hidden', 'true');
			register.classList.remove('flipInY');
			login.removeAttribute('hidden');
			login.classList.add('flipInY');
		}
	},
	false,
);
(function ($) {
	'use strict';

	var input = $('.validate-input .input');
	$('.validate-form').on('submit', function () {
		var check = true;

		for (var i = 0; i < input.length; i++) {
			if (validate(input[i]) == false) {
				showValidate(input[i]);
				check = false;
			}
		}

		return check;
	});

	$('.validate-form .input').each(function () {
		$(this).focus(function () {
			hideValidate(this);
		});
	});

	function validate(input) {
		if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
			if (
				$(input)
					.val()
					.trim()
					.match(
						// eslint-disable-next-line no-useless-escape
						/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/,
					) == null
			) {
				return false;
			}
		} else {
			if ($(input).val().trim() == '') {
				return false;
			}
		}
	}

	function showValidate(input) {
		var thisAlert = $(input).parent();
		$(thisAlert).addClass('alert-validate');
	}

	function hideValidate(input) {
		var thisAlert = $(input).parent();
		$(thisAlert).removeClass('alert-validate');
	}
})(jQuery);
