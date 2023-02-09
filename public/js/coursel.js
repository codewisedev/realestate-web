$(document).ready(function () {
	var owl = $('.owl-carousel');
	owl.owlCarousel({
		responsiveClass: true,
		responsive: {
			0: {
				items: 1,
			},
			600: {
				items: 2,
			},
			1000: {
				items: 3,
			},
		},
		margin: 10,
		loop: true,
		dots: false,
		nav: false,
		autoplay: true,
		autoplayHoverPause: true,
	});

	$('.customNextBtn').click(function () {
		owl.trigger('next.owl.carousel');
	});
	$('.customPrevBtn').click(function () {
		owl.trigger('prev.owl.carousel', [300]);
	});
});
