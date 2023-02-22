'use strict';

const API = `https://api.dictionaryapi.dev/api/v2/entries/en/<word>`;
const fontSwitcherDropdown = document.querySelector('[data-font-switcher]');

fontSwitcherDropdown.addEventListener('change', function (event) {
	const { value } = event.target;
	document.body.classList.remove('serif');
	value === 'serif' && document.body.classList.add('serif');
});
