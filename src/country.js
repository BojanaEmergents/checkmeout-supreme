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
	document.getElementById("jp-prefecture").hidden = true;
	document.getElementById("shopping-list-group").hidden = false;

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
	document.getElementById("keyword-section").hidden = false;
	document.getElementById("us-state").hidden = false;
	document.getElementById("jp-prefecture").hidden = true;
	document.getElementById("shopping-list-group").hidden = false;

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
	document.getElementById("keyword-section").hidden = true;
	document.getElementById("us-state").hidden = true;
	document.getElementById("jp-prefecture").hidden = false;
	document.getElementById("alt-size-group").hidden = false;
	document.getElementById("shopping-list-group").hidden = true;

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