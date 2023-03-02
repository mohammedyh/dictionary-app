const showErrorMessage = require('./utils/showErrorMessage');

const fontSwitcherDropdown = document.querySelector('[data-font-switcher]');
const themeToggle = document.querySelector('.theme-toggle input');
const form = document.querySelector('form');
const definition = document.querySelector('.definition');
const definitionPhonetic = document.querySelector('.definition__phonetic');
const definitionAudioContainer = document.querySelector('.audio__container');
const playAudioBtn = document.querySelector('.play-audio__btn');
const definitionMeaningsList = document.querySelector('.definition__meaning-list');
const definitionType = document.querySelector('.definition__type');
const definitionSynonyms = document.querySelector('.definition__synonyms');

function init() {
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

init();

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
		`https://api.dictionaryapi.dev/api/v2/entries/en/${searchValue}`
	);
	const data = await response.json();

	if (!response.ok) {
		return showErrorMessage(data.title);
	}

	console.log(data);
	// window.apiData = data;

	definition.textContent = data[0].word;
	definitionPhonetic.textContent = data[0].phonetic;
	const { audio = '#' } =
		data[0].phonetics.length && data[0].phonetics.find(phonetic => phonetic.audio !== '');

	createAudioElement(audio);

	definitionType.textContent = data[0].meanings[0].partOfSpeech;
	definitionMeaningsList.replaceChildren('');
	data[0].meanings[0].definitions.forEach(({ definition }) => {
		const definitionListEl = document.createElement('li');
		definitionListEl.textContent = definition;
		definitionMeaningsList.append(definitionListEl);
	});

	definitionSynonyms.textContent = data[0].meanings[0].synonyms.join(', ');

	form.reset();
});

playAudioBtn.addEventListener('click', playAudio);

async function playAudio() {
	const definitionAudio = definitionAudioContainer.querySelector('audio');
	const playIcon = document.querySelector('.play-icon');
	const pauseIcon = document.querySelector('.pause-icon');

	if (!definitionAudio) {
		return showErrorMessage('Audio not available for this word');
	}

	pauseIcon.classList.remove('hidden');
	playIcon.classList.add('hidden');
	definitionAudio.currentTime = 0;
	await definitionAudio.play();

	definitionAudio.addEventListener('ended', function () {
		playIcon.classList.remove('hidden');
		pauseIcon.classList.add('hidden');
	});
}

function createAudioElement(source) {
	if (source.endsWith('#')) return;

	const audio = document.createElement('audio');
	audio.src = source;
	definitionAudioContainer.replaceChildren(audio);
}

themeToggle.addEventListener('change', function () {
	document.documentElement.classList.remove('dark');
	localStorage.setItem('darkMode', this.checked);
	if (this.checked) {
		document.documentElement.classList.add('dark');
	}
});
