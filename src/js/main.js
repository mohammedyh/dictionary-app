const showErrorMessage = require('./utils/showErrorMessage');

const fontSwitcherDropdown = document.querySelector('[data-font-switcher]');
const form = document.querySelector('form');
const definition = document.querySelector('.definition');
const definitionPhonetic = document.querySelector('.definition__phonetic');
const definitionAudioContainer = document.querySelector('.audio__container');
const playAudioBtn = document.querySelector('.play-audio__btn');
const definitionMeaningsList = document.querySelector('.definition__meaning-list');
const definitionType = document.querySelector('.definition__type');

function init() {
	const fontType = localStorage.getItem('fontType');
	if (fontType === 'serif') {
		document.body.classList.add(fontType);
		fontSwitcherDropdown.value = fontType;
	}
}

init();

fontSwitcherDropdown.addEventListener('change', function (event) {
	const { value } = event.target;
	document.body.classList.remove('serif');
	localStorage.setItem('fontType', value);
	if (value === 'serif') {
		document.body.classList.add('serif');
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

	// console.log(data);
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
	form.reset();
});

playAudioBtn.addEventListener('click', playAudio);

async function playAudio() {
	const definitionAudio = definitionAudioContainer.querySelector('audio');
	if (!definitionAudio) {
		return showErrorMessage('Audio not available for this word');
	}

	definitionAudio.currentTime = 0;
	await definitionAudio.play();
}

function createAudioElement(source) {
	if (source.endsWith('#')) return;

	const audio = document.createElement('audio');
	audio.src = source;
	definitionAudioContainer.replaceChildren(audio);
}
