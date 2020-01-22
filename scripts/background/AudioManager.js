// Handles playing hourly music, KK, and the town tune.

'use strict';

function AudioManager(addEventListener, isTownTune) {

	// if eventsEnabled is true, plays event music when appliccable. 
	// Only enable after all game's music-folders contain one .ogg sound file for each event 
	// (i.e. "halloween.ogg" in newLeaf, AC,) 
	// Should also be used for disabling event music for those who have turned them off in the settings, then this  should be false.
	let eventsEnabled = false;

	// If enabled, after 3 seconds, the song will skim to three seconds before
	// the end of the loop time, to easily and quickly test loops.
	let debugLoopTimes = true;

	let audio = document.createElement('audio');
	let killLoopTimeout;
	let killFadeInterval;
	let townTuneManager = new TownTuneManager();
	let timeKeeper = new TimeKeeper();
	let mediaSessionManager = new MediaSessionManager();
	let kkVersion;


	// isHourChange is true if it's an actual hour change,
	// false if we're activating music in the middle of an hour
	function playHourlyMusic(hour, weather, game, isHourChange) {
		//hour = Object.keys(Object.values(Object.values(loopTimes).pop()).pop()).pop();
		hour = 23;
		clearLoop();
		audio.loop = true;
		audio.removeEventListener("ended", playKKSong);
		let fadeOutLength = isHourChange ? 3000 : 500;
		fadeOutAudio(fadeOutLength, () => {
			if (isHourChange && isTownTune()) {
				townTuneManager.playTune(() => {
					playHourSong(game, weather, hour, false);
				});
			} else playHourSong(game, weather, hour, false);
		});

		navigator.mediaSession.setActionHandler('nexttrack', null);
	}

	// Plays a song for an hour, setting up loop times if
	// any exist
	function playHourSong(game, weather, hour, skipIntro) {
		audio.loop = true;

		// STANDARD SONG NAME FORMATTING
		let songName = formatHour(hour);

		// EVENT SONG NAME FORMATTING
		// TODO: Re-enable events.
		/*if(timeKeeper.getEvent() !== "none"){ //getEvent() returns eventname, or "none".
			// Changing the song name to the name of the event, if an event is ongoing.
			songName = timeKeeper.getEvent();
		}*/

		// SETTING AUDIO SOURCE		
		audio.src = `https://ac.pikadude.me/static/${game}/${weather}/${songName}.ogg`;

		let loopTime = ((loopTimes[game] || {})[weather] || {})[hour];
		let delayToLoop;

		if (loopTime) {
			delayToLoop = loopTime.end;

			if (skipIntro) {
				audio.currentTime = loopTime.start;
				delayToLoop -= loopTime.start;
			}
		}

		// If the music is paused via pressing the "close" button in the media session dialogue,
		// then we gracefully handle it rather than going into an invalid state.
		audio.onpause = function () {
			window.notify("pause");

			if (killLoopTimeout) killLoopTimeout();

			chrome.storage.sync.set({ paused: true });
		}

		audio.play().then(setLoopTimes);

		function setLoopTimes() {
			// set up loop points if loopTime is set up for this
			// game, hour and weather.
			if (loopTime) {
				printDebug("setting loop times");

				if (debugLoopTimes) {
					delayToLoop = 8;
					setTimeout(() => {
						printDebug("skimming");
						audio.currentTime = loopTime.end - 5;
					}, 3000);
				}

				let loopTimeout = setTimeout(() => {
					printDebug("looping");
					audio.currentTime = loopTime.start;

					delayToLoop = loopTime.end - loopTime.start;
					setLoopTimes();
				}, delayToLoop * 1000);
				killLoopTimeout = () => {
					printDebug("killing loop timeout");
					clearTimeout(loopTimeout);
					loopTimeout = null;
				};
			} else printDebug("no loop times found. looping full song")
		}

		mediaSessionManager.updateMetadata(game, hour, weather);
	}

	function playKKMusic(_kkVersion) {
		kkVersion = _kkVersion;
		clearLoop();
		audio.loop = false;
		audio.onplay = null
		audio.addEventListener("ended", playKKSong);
		fadeOutAudio(500, playKKSong);

		navigator.mediaSession.setActionHandler('nexttrack', playKKSong);
	}

	function playKKSong() {
		let version;
		if (kkVersion == 'both') {
			if (Math.floor(Math.random() * 2) == 0) version = 'live';
			else version = 'aircheck';
		} else version = kkVersion;

		let randomSong;
		if (version == 'live') randomSong = liveKKSongList[Math.floor(Math.random() * liveKKSongList.length)];
		else if (version == 'aircheck') randomSong = aircheckKKSongList[Math.floor(Math.random() * aircheckKKSongList.length)];
		audio.src = `https://ac.pikadude.me/static/kk/${version}/${randomSong}.ogg`;
		audio.play();

		let formattedTitle = `${randomSong.split(' - ')[1]} (${version.charAt(0).toUpperCase() + version.slice(1)} Version)`;
		window.notify("kkMusic", [formattedTitle]);

		mediaSessionManager.updateMetadataKK(formattedTitle, randomSong);
	}

	// clears the loop point timeout and the fadeout
	// interval if one exists
	function clearLoop() {
		if (typeof (killLoopTimeout) === 'function') killLoopTimeout();
		if (typeof (killFadeInterval) === 'function') killFadeInterval();
	}

	// Fade out audio and call callback when finished.
	function fadeOutAudio(time, callback) {
		if (audio.paused) {
			if (callback) callback();
		} else {
			let oldVolume = audio.volume;
			let step = audio.volume / (time / 100.0);
			let fadeInterval = setInterval(() => {
				if (audio.volume > step) {
					audio.volume -= step;
				} else {
					clearInterval(fadeInterval);
					audio.pause();
					audio.volume = oldVolume;
					if (callback) callback();
				}
			}, 100);
			killFadeInterval = function () {
				clearInterval(fadeInterval);
				audio.volume = oldVolume;
				killFadeInterval = null;
			}
		}
	}

	addEventListener("hourMusic", playHourlyMusic);

	addEventListener("kkStart", playKKMusic);

	addEventListener("gameChange", playHourlyMusic);

	addEventListener("pause", () => {
		clearLoop();
		fadeOutAudio(300);
	});

	addEventListener("volume", newVol => {
		audio.volume = newVol;
	});

}
