//TODO: CkEditor

//* CkEditor Config
// eslint-disable-next-line no-unused-vars
function ckEditor(minCharacters) {
	const container = document.querySelector('.demo-update');
	const progressCircle = document.querySelector('.demo-update__chart__circle');
	const charactersBox = document.querySelector(
		'.demo-update__chart__characters',
	);
	const wordsBox = document.querySelector('.demo-update__words');
	const circleCircumference = Math.floor(
		2 * Math.PI * progressCircle.getAttribute('r'),
	);
	ClassicEditor.create(document.querySelector('#editor'), {
		toolbar: {
			items: [
				'heading',
				'fontSize',
				'fontColor',
				'fontBackgroundColor',
				'highlight',
				'|',
				'removeFormat',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'superscript',
				'subscript',
				'bulletedList',
				'numberedList',
				'horizontalLine',
				'specialCharacters',
				'MathType',
				'|',
				'indent',
				'outdent',
				'alignment',
				'|',
				'link',
				'imageUpload',
				'insertTable',
				'blockQuote',
				'mediaEmbed',
				'|',
				'undo',
				'redo',
				'|',
				'code',
				'codeBlock',
			],
		},
		language: 'fa',
		image: {
			toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'],
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells',
				'tableCellProperties',
				'tableProperties',
			],
		},
		licenseKey: '',
		simpleUpload: {
			uploadUrl: '/upload-image',
			headers: {
				'X-CSRF-TOKEN': 'CSFR-Token',
				Authorization: 'Bearer <JSON Web Token>',
			},
		},
		wordCount: {
			onUpdate: (stats) => {
				const charactersProgress =
					(stats.characters / minCharacters) * circleCircumference;
				const isLimitExceeded = stats.characters < minCharacters;
				const isCloseToLimit =
					!isLimitExceeded && stats.characters < minCharacters * 0.8;
				const circleDashArray = Math.min(
					charactersProgress,
					circleCircumference,
				);

				progressCircle.setAttribute(
					'stroke-dasharray',
					`${circleDashArray},${circleCircumference}`,
				);
				if (isLimitExceeded) {
					charactersBox.textContent = `${stats.characters - minCharacters}`;
				} else {
					charactersBox.textContent = stats.characters;
				}
				wordsBox.textContent = `تعداد کلمات: ${stats.words}`;
				container.classList.toggle('demo-update__limit-close', isCloseToLimit);
				container.classList.toggle(
					'demo-update__limit-exceeded',
					isLimitExceeded,
				);
			},
		},
	})
		.then((editor) => {
			window.editor = editor;
		})
		.catch((error) => {
			console.error(error);
		});
}
//! *****************************
