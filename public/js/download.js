//TODO: Download App Slide

(function () {
	var el = document.getElementById('draggable'),
		elWidth = parseInt(window.getComputedStyle(el, null)['width']),
		elLeft = el.offsetLeft,
		elRight = elLeft + elWidth,
		frame = document.getElementById('as-frame'),
		frameLeft = frame.offsetLeft,
		frameWidth = parseInt(window.getComputedStyle(frame, null)['width']),
		frameRight = frameLeft + frameWidth,
		desc = document.getElementById('as-app-description'),
		leftNavButton = document.getElementById('as-left-nav-button'),
		rightNavButton = document.getElementById('as-right-nav-button');

	leftNavButton.addEventListener(
		'click',
		function () {
			scrollScreen(300, 'left');
		},
		false,
	);

	rightNavButton.addEventListener(
		'click',
		function () {
			scrollScreen(300, 'right');
		},
		false,
	);

	var focus = false;
	function scrollScreen(val, dir) {
		var left = el.offsetLeft;

		if (dir == 'left') {
			var deltaRight = elRight - frameRight;
			if (deltaRight >= val) {
				left -= val;
			} else {
				left -= deltaRight + 5;
			}
		} else if (dir == 'right') {
			var deltaLeft = frameLeft - left;
			if (deltaLeft >= val) {
				left += val;
			} else {
				left += deltaLeft;
			}
		}

		if (left <= frameLeft && elRight >= frameRight - 5) {
			el.style.left = left + 'px';
			elRight = left + elWidth;
			showHideDesc();
		}
	}

	var mouseDownStartPosition, delta;

	el.addEventListener('mousedown', startDrag, false);
	el.addEventListener('touchstart', startDrag, false);

	function startDrag(event) {
		el.setAttribute('unselectable', 'on');

		(elLeft = el.offsetLeft),
			(mouseDownStartPosition = event.pageX),
			(delta = mouseDownStartPosition - elLeft);

		document.addEventListener('mousemove', moveEl, true);
		document.addEventListener('mouseup', quitDrag, false);
		document.addEventListener('touchmove', moveEl, true);
		document.addEventListener('touchend', quitDrag, false);
	}

	function moveEl(e) {
		var moveX = e.pageX,
			newPos = moveX - delta;
		elLeft = newPos;
		elRight = newPos + elWidth;
		if (elRight >= frameRight - 5 && elLeft <= frameLeft) {
			el.style.left = newPos + 'px';
			showHideDesc();
		}
	}

	function showHideDesc() {
		if (elRight <= frameRight + 400 && !focus) {
			desc.classList.add('visible-description');
			$('.app').hide();
		} else {
			desc.classList.remove('visible-description');
			$('.app').show();
		}
	}

	function quitDrag() {
		document.removeEventListener('mousemove', moveEl, true);
		el.setAttribute('unselectable', 'off');
	}
})();
