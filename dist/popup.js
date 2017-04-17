var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-87467388-2']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

document.addEventListener('DOMContentLoaded', function() {
	var link = document.getElementById('run');
	var optspage = document.getElementById("opts");
	var instpage = document.getElementById("inst");

	chrome.tabs.executeScript(null, {file: "js/jquery.min.js"});
	chrome.tabs.executeScript(null, {file: "js/bootstrap-notify.min.js"});
	chrome.tabs.executeScript(null, {file: "js/fuse.min.js"});

	link.addEventListener('click', function(e) {
		_gaq.push(['_trackEvent', e.target.id, 'clicked']);
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

	chrome.storage.sync.get({
		name: ''
	},
	function(items) {
		document.getElementById("welcome").innerText = "Welcome, " + items.name.split(' ')[0];
	});
});