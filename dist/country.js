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
	document.getElementById("jp-name-prompt").hidden = true;
	document.getElementById("keyword-section").hidden = false;
	document.getElementById("us-state").hidden = true;
	document.getElementById("jp-prefecture").hidden = true;
	document.getElementById("shopping-list-group").hidden = false;

	document.getElementById("eu").className = "logo-lred";
	document.getElementById("us").className = "";
	document.getElementById("jp").className = "";

	$.notify({
			message: "Set region to EU."
		},
		{
			animate: {
				enter: 'animated fadeInDown',
				exit: 'animated fadeOutUp'
			},
			delay: 2000
		});
}

function setUS() {
	chrome.storage.sync.set({
		region: "us"
	});
	document.getElementById("jp-name-prompt").hidden = true;
	document.getElementById("keyword-section").hidden = false;
	document.getElementById("us-state").hidden = false;
	document.getElementById("jp-prefecture").hidden = true;
	document.getElementById("shopping-list-group").hidden = false;

	document.getElementById("eu").className = "";
	document.getElementById("us").className = "logo-lred";
	document.getElementById("jp").className = "";

	$.notify({
			message: "Set region to US."
		},
		{
			animate: {
				enter: 'animated fadeInDown',
				exit: 'animated fadeOutUp'
			},
			delay: 2000
		});
}

function setJP() {
	chrome.storage.sync.set({
		region: "jp"
	});
	document.getElementById("jp-name-prompt").hidden = false;
	document.getElementById("keyword-section").hidden = true;
	document.getElementById("us-state").hidden = true;
	document.getElementById("jp-prefecture").hidden = false;
	document.getElementById("alt-size-group").hidden = false;
	document.getElementById("shopping-list-group").hidden = true;

	document.getElementById("eu").className = "";
	document.getElementById("us").className = "";
	document.getElementById("jp").className = "logo-lred";

	$.notify({
			message: "Set region to JP."
		},
		{
			animate: {
				enter: 'animated fadeInDown',
				exit: 'animated fadeOutUp'
			},
			delay: 2000
		});
}