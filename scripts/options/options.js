'use strict';

const onClickElements = [
	'animal-crossing',
	'wild-world',
	'new-leaf',
	'game-random',
	'sunny',
	'snowing',
	'raining',
	'live',
	'weather-random',
	'no-kk',
	'enable-kk',
	'always-kk',
	'enable-town-tune',
	'enable-notifications',
	'enable-badge',
	'kk-version-live',
	'kk-version-aircheck',
	'kk-version-both'
];

window.onload = function () {
	restoreOptions();

	document.getElementById('version-number').textContent = 'Version ' + chrome.runtime.getManifest().version;

	document.getElementById('volume').oninput = saveOptions;
	onClickElements.forEach(el => {
		document.getElementById(el).onclick = saveOptions;
	});
	document.getElementById('update-location').onclick = validateWeather;

	updateContributors();
}

function saveOptions() {
	let volume = document.getElementById('volume').value;
	let enableNotifications = document.getElementById('enable-notifications').checked;
	// 2 separate KK variables to preserve compatibility with old versions
	let alwaysKK = document.getElementById('always-kk').checked;
	let enableKK = alwaysKK || document.getElementById('enable-kk').checked;
	let enableTownTune = document.getElementById('enable-town-tune').checked;
	let zipCode = document.getElementById('zip-code').value;
	let countryCode = document.getElementById('country-code').value;
	let enableBadgeText = document.getElementById('enable-badge').checked;

	let music;
	let weather;
	if (document.getElementById('animal-crossing').checked) music = 'animal-crossing';
	else if (document.getElementById('wild-world').checked) music = 'wild-world';
	else if (document.getElementById('new-leaf').checked) music = 'new-leaf';
	else if (document.getElementById('game-random').checked) music = 'game-random';

	if (document.getElementById('sunny').checked) weather = 'sunny';
	else if (document.getElementById('snowing').checked) weather = 'snowing';
	else if (document.getElementById('raining').checked) weather = 'raining';
	else if (document.getElementById('live').checked) weather = 'live';
	else if (document.getElementById('weather-random').checked) weather = 'weather-random';

	let kkVersion;
	if (document.getElementById('kk-version-live').checked) kkVersion = 'live';
	else if (document.getElementById('kk-version-aircheck').checked) kkVersion = 'aircheck';
	else if (document.getElementById('kk-version-both').checked) kkVersion = 'both';

	document.getElementById('raining').disabled = music == 'animal-crossing';

	let enabledKKVersion = !(document.getElementById('always-kk').checked || document.getElementById('enable-kk').checked);

	document.getElementById('music-selection').querySelectorAll('input').forEach(updateChildrenState.bind(null, alwaysKK));
	document.getElementById('kk-version-selection').querySelectorAll('input').forEach(updateChildrenState.bind(null, enabledKKVersion));
	
	chrome.storage.sync.set({
		volume,
		music,
		weather,
		enableNotifications,
		enableKK,
		alwaysKK,
		kkVersion,
		enableTownTune,
		zipCode,
		countryCode,
		enableBadgeText
	});
}

function updateChildrenState(disabled, childElement){		
	childElement.disabled = disabled
}
function restoreOptions() {
	chrome.storage.sync.get({
		volume: 0.5,
		music: 'new-leaf',
		weather: 'sunny',
		enableNotifications: true,
		enableKK: true,
		alwaysKK: false,
		kkVersion: 'live',
		enableTownTune: true,
		zipCode: "98052",
		countryCode: "us",
		enableBadgeText: true
	}, items => {
		document.getElementById('volume').value = items.volume;
		document.getElementById(items.music).checked = true;
		document.getElementById(items.weather).checked = true;
		document.getElementById('enable-notifications').checked = items.enableNotifications;
		document.getElementById('no-kk').checked = true;
		document.getElementById('enable-kk').checked = items.enableKK;
		document.getElementById('always-kk').checked = items.alwaysKK;
		document.getElementById('kk-version-' + items.kkVersion).checked = true;
		document.getElementById('enable-town-tune').checked = items.enableTownTune;
		document.getElementById('zip-code').value = items.zipCode;
		document.getElementById('country-code').value = items.countryCode;
		document.getElementById('enable-badge').checked = items.enableBadgeText;

		// Disable raining if the game is animal crossing, since there is no raining music for animal crossing.
		document.getElementById('raining').disabled = items.music == 'animal-crossing';

		let enabledKKVersion = !(document.getElementById('always-kk').checked || document.getElementById('enable-kk').checked);
		document.getElementById('kk-version-selection').querySelectorAll('input').forEach(updateChildrenState.bind(null, enabledKKVersion));
		document.getElementById('music-selection').querySelectorAll('input').forEach(updateChildrenState.bind(null, items.alwaysKK));
	});
}

function validateWeather() {
	let updateLocationEl = document.getElementById('update-location');
	updateLocationEl.textContent = "Validating...";
	updateLocationEl.disabled = true;

	let zip = document.getElementById('zip-code').value;
	let country = document.getElementById('country-code').value;
	if (zip == '') {
		responseMessage('You must specify a zip code.');
		return;
	}
	if (country == '') {
		responseMessage('You must specify a country code.');
		return;
	}

	let appid = "e7f97bd1900b94491d3263f89cbe28d6";
	let url = `http://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&appid=${appid}`;
	let request = new XMLHttpRequest();

	request.onload = function () {
		let response;
		try {
			response = JSON.parse(request.responseText);
		} catch (Exception) {
			responseMessage();
			return;
		}

		if (response.cod == "200") responseMessage(`Success! The current weather status in ${response.name}, ${response.sys.country} is "${response.weather[0].main}"`, true);
		else {
			if (response.message) responseMessage(response.message.charAt(0).toUpperCase() + response.message.slice(1));
			else responseMessage();
		}
	}

	request.onerror = responseMessage;

	request.open("GET", url, true);
	request.send();

	function responseMessage(message = 'An unknown error occurred', success = false) {
		let weatherResponseEl = document.getElementById('weather-response');
		if (success == true) {
			weatherResponseEl.style.color = "#39d462";
			saveOptions();
		} else weatherResponseEl.style.color = "#d43939";
		weatherResponseEl.textContent = message;

		updateLocationEl.textContent = "Update Location";
		updateLocationEl.disabled = false;
	}
}