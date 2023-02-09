//TODO: Profile Picker JS Code

//* Enable Strict Mode
'use strict';

$(document).ready(() => {
	//* Hidden Remove Button
	$('.remove-profile-button').hide();

	var readURL = (input) => {
		let reader = new FileReader();
		if (input.files && input.files[0]) {
			reader.onload = (e) => {
				//* Set Profile Picture
				$('.profile-pic').attr('src', e.target.result);

				//* Disabled Radio Button
				var radio = document.getElementsByClassName('radio-select');
				for (let i = 0; i < radio.length; i++) {
					radio[i].disabled = true;
					radio[i].checked = false;
				}

				//* Add Grayscale Filter
				var img = document.getElementsByClassName('img-avatar');
				for (let i = 0; i < img.length; i++) {
					img[i].classList.add('grayscale');
				}

				//* Show Or Hide Element
				$('.upload-profile-button').hide();
				$('.radio-checkmark').hide();
				$('.remove-profile-button').show();
			};

			reader.readAsDataURL(input.files[0]);
		}
	};

	$('.profile-upload').on('change', function () {
		readURL(this);
	});

	$('.profile-pic').on('click', function () {
		$('.profile-upload').click();
	});

	$('.upload-profile-button').on('click', function () {
		$('.profile-upload').click();
	});

	$('.remove-profile-button').on('click', function () {
		//* Show Or Hide Element
		$('.upload-profile-button').show();
		$('.remove-profile-button').hide();
		$('.radio-checkmark').show();

		//* Default Profile Picture
		$('.profile-pic').attr('src', '/images/profile.png');

		//* Enable Radio Button
		var radio = document.getElementsByClassName('radio-select');
		for (var i = 0; i < radio.length; i++) {
			radio[i].disabled = false;
		}
		radio[0].checked = true;

		//* Remove Uploaded File
		$('.profile-upload').val('');

		//* Remove Grayscale Filter
		var img = document.getElementsByClassName('img-avatar');
		for (let i = 0; i < img.length; i++) {
			img[i].classList.remove('grayscale');
		}
	});
});
//! *****************************
