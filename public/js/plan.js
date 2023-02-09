const cardWidth = $('.card-slider_card:not(.active)').width();

goToCard($('.card-slider_card.active'));

$('.card-slider_card').click((e) => {
	let $currentCard = $(e.target).closest('.card-slider_card');
	goToCard($currentCard);
});

$('.previous').click(goToPreviousCard);
$('.next').click(goToNextCard);

function goToCard($card) {
	if (!$card.hasClass('active')) {
		$('.active-out, .active-in').removeClass('active-out active-in');
		$('.card-slider_card.active').addClass('active-out').removeClass('active');
		$card.closest('.card-slider_card').addClass('active active-in');
	}

	let currentPos = $('.card-slider_card').index($card);
	let scrollPos = cardWidth * currentPos;

	$('.card-slider_list').css(
		{
			transform: 'translateX(-' + scrollPos + 'px)',
		},
		200,
	);
}

function goToNextCard() {
	let $nextCard = $('.card-slider_card.active').next('.card-slider_card');
	if ($nextCard.length) {
		goToCard($nextCard);
	}
}

function goToPreviousCard() {
	let $previousCard = $('.card-slider_card.active').prev('.card-slider_card');
	if ($previousCard.length) {
		goToCard($previousCard);
	}
}
