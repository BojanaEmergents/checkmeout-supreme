 document.addEventListener('DOMContentLoaded', function() {
	var link = document.getElementById('run');
	var optspage = document.getElementById("opts");
	var instpage = document.getElementById("inst");

	link.addEventListener('click', function() {
		chrome.storage.sync.set({
			runnable: true
		},
		function() {
			chrome.tabs.executeScript(null, {file: "navigate.js"});
		});
	});

	optspage.addEventListener('click', function() {
		chrome.tabs.create({url: "options.html"});
	});
	instpage.addEventListener('click', function() {
		chrome.tabs.create({url: "https://checkmeout.pro/instructions"});
	});
   

	setInterval(function() {
		var d = new Date();
		document.getElementById('time').innerText = new Date(new Date().getTime()).toLocaleTimeString('en-GB', { hour12: false });
		chrome.storage.sync.get({
			ar_enabled: '',
			start_time: ''
		},
		function(items) {
			if (items.ar_enabled && document.getElementById('time').innerText == items.start_time) {
				chrome.storage.sync.set({
					runnable: true
				},
				function() {
					setInterval(function() {
						console.log("searching...");
						chrome.tabs.executeScript(null, {file: "navigate.js"});
					}, (750 + (1250 - 750) * Math.random()));
				});
			}
		});
	}, 50);
});