const showErrorMessage = require('./utils/showErrorMessage');

const form = document.querySelector('form');
const fontSwitcherDropdown = document.querySelector('.font-switcher');
const themeToggle = document.querySelector('.theme-toggle input');
const definitionContainer = document.querySelector('.definition__container');

function loadUserPreferences() {
	const fontType = localStorage.getItem('fontType');
	const isDarkMode = localStorage.getItem('darkMode');
	if (fontType === 'sans-serif') {
		document.body.classList.add(fontType);
		fontSwitcherDropdown.value = fontType;
	}

	if (isDarkMode === 'true') {
		document.documentElement.classList.add('dark');
		themeToggle.checked = isDarkMode;
	}
}

loadUserPreferences();

fontSwitcherDropdown.addEventListener('change', function (event) {
	const { value } = event.target;
	document.body.classList.remove('sans-serif');
	localStorage.setItem('fontType', value);
	if (value === 'sans-serif') {
		document.body.classList.add('sans-serif');
	}
});

form.addEventListener('submit', async function (event) {
	event.preventDefault();
	const searchValue = event.target.elements.search.value;
	if (searchValue.trim().length === 0) {
		return showErrorMessage('Enter a valid word');
	}

	const response = await fetch(
		`https://api.dictionaryapi.dev/api/v2/entries/en/${searchValue}`,
	);
	const data = await response.json();

	if (!response.ok) {
		return showErrorMessage(data.title);
	}

	definitionContainer.replaceChildren('');
	data.forEach(definitionData => {
		const { audio } = definitionData.phonetics.find(({ audio }) => audio !== '') ?? {
			audio: '#',
		};

		const meaningsHTML = definitionData.meanings
			.map(meaning => {
				const synonymsBtns = meaning.synonyms
					.map(synonym => `<button class="synonym__btn">${synonym}</button>`)
					.join('');
				return `
				<div class="definition__info">
					<h2 class="definition__type">${meaning.partOfSpeech}</h2>
					<h3 class="definition__meaning-heading">Meanings</h3>
					<ul class="definition__meaning-list">
						${meaning.definitions.map(({ definition }) => `<li>${definition}</li>`).join('')}
					</ul>

					${
						synonymsBtns.length !== 0
							? `<div class="synonyms__container">
									<h3>Synonyms</h3>
									<div class="synonym-btns__container">
										${synonymsBtns}
									</div>
								</div>`
							: ''
					}
				</div>
			`;
			})
			.join('');

		definitionContainer.innerHTML += `
			<div class="definition__wrapper">
				<div class="definition__header">
					<div>
						<h1 class="definition">${definitionData.word}</h1>
						<h2 class="definition__phonetic">${definitionData.phonetic ?? ''}</h2>
					</div>

					<div>
						<button class="play-audio__btn">
							<div class="audio__container">
								<audio src="${audio}"></audio>
							</div>
							<div class="play-audio__icon">
								<!-- Play icon -->
								<svg
									class="play-icon"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="#a544e8"
									width="25"
								>
									<path
										fill-rule="evenodd"
										d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
										clip-rule="evenodd"
									/>
								</svg>

								<!-- Pause icon -->
								<svg
									class="pause-icon hidden"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="#a544e8"
									width="25"
								>
									<path
										fill-rule="evenodd"
										d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						</button>
					</div>
				</div>

				${meaningsHTML}
			</div>
		`;
	});

	document.querySelectorAll('.play-audio__btn').forEach(audioBtn => {
		audioBtn.addEventListener('click', async function () {
			const audioEl = audioBtn.querySelector('audio');
			const playIcon = audioBtn.querySelector('.play-icon');
			const pauseIcon = audioBtn.querySelector('.pause-icon');

			if (audioEl.src.endsWith('#')) {
				return showErrorMessage('No audio available for this word');
			}

			pauseIcon.classList.remove('hidden');
			playIcon.classList.add('hidden');
			audioEl.currentTime = 0;
			await audioEl.play();

			audioEl.addEventListener('ended', function () {
				playIcon.classList.remove('hidden');
				pauseIcon.classList.add('hidden');
			});
		});
	});
	form.reset();
});

themeToggle.addEventListener('change', function () {
	document.documentElement.classList.remove('dark');
	localStorage.setItem('darkMode', this.checked);
	if (this.checked) {
		document.documentElement.classList.add('dark');
	}
});
