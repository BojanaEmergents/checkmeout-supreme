document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.sync.get({
		region: ''
	},
	function(items) {
		if (items.region == "eu") {
			setEU();
		}
		if (items.region == "us") {
			setUS();
		}
		if (items.region == "jp") {
			setJP();
		}
	});
});

document.getElementById("eu").addEventListener("click", setEU);
document.getElementById("us").addEventListener("click", setUS);
document.getElementById("jp").addEventListener("click", setJP);

function setEU() {
	chrome.storage.sync.set({
		region: "eu"
	});
	document.getElementById("keyword-section").hidden = false;

	document.getElementById("us-state").hidden = true;
}

function setUS() {
	chrome.storage.sync.set({
		region: "us"
	});
	document.getElementById("keyword-section").hidden = false;

	document.getElementById("us-state").hidden = false;
}

function setJP() {
	chrome.storage.sync.set({
		region: "jp"
	});
	document.getElementById("keyword-section").hidden = true;

	document.getElementById("us-state").hidden = true;
}