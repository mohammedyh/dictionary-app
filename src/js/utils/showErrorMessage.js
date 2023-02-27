const Toastify = require('toastify-js');

function showErrorMessage(text) {
	Toastify({
		text,
		duration: 4000,
		style: { background: '#cb0a18' },
	}).showToast();
}

module.exports = showErrorMessage;
