//TODO: Profile Picker JS Code

//* Enable Strict Mode
'use strict';

$(document).ready(() => {
	//* Hidden Remove Button
	$('.remove-logo-button').hide();

	var readURL = (input) => {
		let reader = new FileReader();
		if (input.files && input.files[0]) {
			reader.onload = (e) => {
				//* Set Profile Picture
				$('.logo-pic').attr('src', e.target.result);

				//* Show Or Hide Element
				$('.upload-logo-button').hide();
				$('.remove-logo-button').show();
			};

			reader.readAsDataURL(input.files[0]);
		}
	};

	$('.logo-upload').on('change', function () {
		readURL(this);
	});

	$('.logo-pic').on('click', function () {
		$('.logo-upload').click();
	});

	$('.upload-logo-button').on('click', function () {
		$('.logo-upload').click();
	});

	$('.remove-logo-button').on('click', function () {
		//* Show Or Hide Element
		$('.upload-logo-button').show();
		$('.remove-logo-button').hide();

		//* Default Profile Picture
		$('.logo-pic').attr('src', '/images/logo-placeholder.png');

		//* Remove Uploaded File
		$('.logo-upload').val('');
	});
});
//! *****************************
