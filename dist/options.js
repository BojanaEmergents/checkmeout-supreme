var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-87467388-2']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

// Saves options to chrome.storage
function save_options() {
	var name = document.getElementById("name").value;
	var email = document.getElementById("email").value;
	var phone = document.getElementById("phone").value;
	var address = document.getElementById("address").value;
	var address2 = document.getElementById("address2").value;
	var address3 = document.getElementById("address3").value;
	var city = document.getElementById("city").value;
	var zip = document.getElementById("zip").value;
	var state = document.getElementById("state").value.toUpperCase();
	var prefecture = document.getElementById("prefecture").value;
	var country = document.getElementById("country").value;

	var card_type = document.getElementById("card_type").value;
	var card_no = document.getElementById("card_no").value;
	var expiry_month = document.getElementById("expiry_month").value;
	var expiry_year = document.getElementById("expiry_year").value;
	var cvv = document.getElementById("cvv").value;
	var alt_size = document.getElementById("alt-size").value;
	var any_size = document.getElementById("any_size").checked;
	var autoco = document.getElementById("autoco").checked;
	var tryagain = document.getElementById("tryagain").checked;
	var bypass = document.getElementById("bypass").checked;
	var delay = document.getElementById("delay").value;
	
	var kw_enabled = document.getElementById("kw_enabled").checked;
	var ar_enabled = document.getElementById("ar_enabled").checked;
	var start_time = document.getElementById("start_time").value;
	var category = document.getElementById("category").value;
	var keywords = document.getElementById("keywords").value;
	var colour = document.getElementById("colour").value;
	var size = document.getElementById("size").value;
	//var tc_accepted = document.getElementById("tc_accepted").checked;

	chrome.storage.sync.set({
		name: name,
		email: email,
		phone: phone,
		address: address,
		address2: address2,
		address3: address3,
		city: city,
		zip: zip,
		state: state,
		prefecture: prefecture,
		country: country,

		card_type: card_type,
		card_no: card_no,
		expiry_month: expiry_month,
		expiry_year: expiry_year,
		cvv: cvv,
		alt_size: alt_size,
		any_size: any_size,
		autoco: autoco,
		tryagain: tryagain,
		bypass: bypass,
		delay: delay,

		kw_enabled: kw_enabled,
		ar_enabled: ar_enabled,
		start_time: start_time,
		category: category,
		keywords: keywords,
		colour: colour,
		size: size,
		queue: queue_list,
		//tc_accepted: tc_accepted
	}, 
	function() {
		// Show notification to let user know options were saved.
		$.notify({
			title: "<b>Success</b><br>",
			message: "Your settings have been saved successfully."
		},
		{
			type: 'success',
			animate: {
				enter: 'animated fadeInDown',
				exit: 'animated fadeOutUp'
			},
			delay: 2000
		});
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		name: '',
		email: '',
		phone: '',
		address: '',
		address2: '',
		address3: '',
		city: '',
		zip: '',
		state: '',
		prefecture: '',
		country: '',

		card_type: '',
		card_no: '',
		expiry_month: '',
		expiry_year: '',
		cvv: '',
		alt_size: '',
		any_size: '',
		autoco: '',
		tryagain: '',
		bypass: '',
		delay: '',

		kw_enabled: '',
		ar_enabled: '',
		start_time: '',
		category: '',
		keywords: '',
		colour: '',
		size: '',
		queue: [],
		report: '',
		proxy: '',
		proxy_enabled: '',
		//tc_accepted: ''
	}, 
	function(items) {
		document.getElementById("log-out").innerText = JSON.stringify(items.report, null, 2);
		$("#changelog-out").load("CHANGELOG");

		document.getElementById('name').value = items.name;
		document.getElementById("email").value = items.email;
		document.getElementById("phone").value = items.phone;
		document.getElementById("address").value = items.address;
		document.getElementById("address2").value = items.address2;
		document.getElementById("address3").value = items.address3;
		document.getElementById("city").value = items.city;
		document.getElementById("zip").value = items.zip;
		document.getElementById("state").value = items.state;
		document.getElementById("prefecture").value = items.prefecture;
		document.getElementById("country").value = items.country;

		document.getElementById("card_type").value = items.card_type;
		document.getElementById("card_no").value = items.card_no;
		document.getElementById("expiry_month").value = items.expiry_month;
		document.getElementById("expiry_year").value = items.expiry_year;
		document.getElementById("cvv").value = items.cvv;
		document.getElementById("alt-size").value = items.alt_size;
		document.getElementById("any_size").checked = items.any_size;
		document.getElementById("autoco").checked = items.autoco;
		document.getElementById("tryagain").checked = items.tryagain;
		document.getElementById("delay").value = items.delay;
		document.getElementById("delay_text").innerText = items.delay + " seconds";

		document.getElementById("kw_enabled").checked = items.kw_enabled;
		document.getElementById("ar_enabled").checked = items.ar_enabled;
		document.getElementById("start_time").value = items.start_time;
		document.getElementById("category").value = items.category;
		document.getElementById("keywords").value = items.keywords;
		document.getElementById("colour").value = items.colour;
		document.getElementById("size").value = items.size;

		queue_list = items.queue;
		for (item in items.queue) {
			$('#queue-list').append($('<li class="list-group-item shopping-item">').html(items.queue[item][0]+": "+items.queue[item][1]+" - "+items.queue[item][2]+" ("+items.queue[item][3]+") <p class=\"delete-hint\">delete</p>"));
		}

		if (items.kw_enabled) {
			document.getElementById("alt-size-group").hidden = true;
			document.getElementById("kw-form-group").hidden = false;
		}
		else {
			document.getElementById("alt-size-group").hidden = false;
			document.getElementById("kw-form-group").hidden = true;
		}

		document.getElementById("ver").innerHTML = chrome.runtime.getManifest().version + "&nbsp;";

		document.getElementById("proxy-data").value = items.proxy;
		document.getElementById("proxy_enabled").checked = items.proxy_enabled;

		if (items.bypass) {
			document.getElementById("bypass").checked = false;
			chrome.storage.sync.set({bypass: false}, null);
		}
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

// update delay text when user moves the slider
function update_delay() {
	document.getElementById("delay_text").innerText = document.getElementById("delay").value + " seconds";
	if (document.getElementById("delay").value <= 2.5) {
		document.getElementById("delay_text").style.color = "red";
	}
	else {
		document.getElementById("delay_text").style.color = "black";
	}
}
document.getElementById("delay").addEventListener("input", update_delay);

// enable bootstrap tooltips
$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})

// set up clipboard
new Clipboard('.btn');

// show warning if user enters keywords without enabling them
$('#keywords').on('input propertychange paste', function() {
	if (!$('#kw_enabled').is(':checked')) {
		$('#keywords').tooltip('show');
	}
	else {
		$('#keywords').tooltip('hide');
	}
});

// clear sections
$("#clear-shipping").click(function() {
	document.getElementById('name').value = "";
	document.getElementById("email").value = "";
	document.getElementById("phone").value = "";
	document.getElementById("address").value = "";
	document.getElementById("address2").value = "";
	document.getElementById("address3").value = "";
	document.getElementById("city").value = "";
	document.getElementById("zip").value = "";
	document.getElementById("state").value = "";
	document.getElementById("prefecture").value = "";
	document.getElementById("country").value = "";
});
$("#clear-payment").click(function() {
	document.getElementById("card_type").value = "";
	document.getElementById("card_no").value = "";
	document.getElementById("expiry_month").value = "";
	document.getElementById("expiry_year").value = "";
	document.getElementById("cvv").value = "";
	document.getElementById("any_size").checked = "";
	document.getElementById("autoco").checked = "";
	document.getElementById("tryagain").checked = "";
	document.getElementById("delay").value = "";
	document.getElementById("delay_text").innerText = "";
});
$("#clear-keywords").click(function() {
	document.getElementById("kw_enabled").checked = "";
	document.getElementById("ar_enabled").checked = "";
	document.getElementById("start_time").value = "";
	document.getElementById("category").value = "";
	document.getElementById("keywords").value = "";
	document.getElementById("colour").value = "";
	document.getElementById("size").value = "";
});

// delete all data
$("#delete-all").click(function() {
	chrome.storage.sync.clear();
});

// add an item to the shopping list
$('#add-queue').click(function() {
	var queue_category = $('#category')[0].value;
	var category_index = $('#category')[0].selectedIndex;
	var queue_name = $('#keywords')[0].value;
	var queue_colour = $('#colour')[0].value;
	var queue_size = $('#size')[0].value;

	if (queue_category && queue_name && queue_size) {
		$('#queue-list').append($('<li class="list-group-item shopping-item">').html($('#category')[0][category_index].innerHTML+": "+queue_name+" - "+queue_colour+" ("+queue_size+") <p class=\"delete-hint\">delete</p>"));

		var queue_item = [];
		queue_item.push(queue_category);
		queue_item.push(queue_name);
		queue_item.push(queue_colour);
		queue_item.push(queue_size);
		queue_list.push(queue_item);

		document.getElementById("category").value = "";
		document.getElementById("keywords").value = "";
		document.getElementById("colour").value = "";
		document.getElementById("size").value = "";

		$.notify({
			title: "<b>Success</b><br>",
			message: "Item added to shopping list."
		},
		{
			type: 'success',
			animate: {
				enter: 'animated fadeInDown',
				exit: 'animated fadeOutUp'
			},
			delay: 2000
		});
	}
	else {
		$('#keyword-alert')[0].style.display = 'block';
	}
});

// delete an item from the shopping list
$("#queue-list").on("click", ".shopping-item", function(event) {
	var i = $(this).index();
	queue_list.splice(i-1, 1);
	$('#queue-list li').eq(i).remove();

	$.notify({
			title: "<b>Success</b><br>",
			message: "Item removed from shopping list."
		},
		{
			type: 'success',
			animate: {
				enter: 'animated fadeInDown',
				exit: 'animated fadeOutUp'
			},
			delay: 2000
		});
});

$('#keyword-alert-dismiss').click(function() {
	$('#keyword-alert')[0].style.display = 'none';
});

// update shopping list date
setInterval(function() {
	var d = new Date();
	document.getElementById('shopping-date').innerText = d.toDateString();
}, 1000);

// disable save button unless user accepts t&cs
document.getElementById("save").disabled = !document.getElementById("tc_accepted").checked;
document.getElementById("tc_accepted").addEventListener("click", tc_button);
function tc_button() {
	document.getElementById('save').disabled = !document.getElementById("tc_accepted").checked;
}

// hide/show sections when keywords are enabled/disabled
$('#kw_enabled').click(function() {
	if (document.getElementById('kw_enabled').checked) {
		document.getElementById("alt-size-group").hidden = true;
		document.getElementById("kw-form-group").hidden = false;
	}
	else {
		document.getElementById("alt-size-group").hidden = false;
		document.getElementById("kw-form-group").hidden = true;
	}
});

// proxy settings
$('#save-proxy').click(function() {
	chrome.storage.sync.set({proxy: $('#proxy-data').val()}, null);

	var host = $('#proxy-data').val().split(':')[0];
	var port = parseInt($('#proxy-data').val().split(':')[1]);

	var proxy_config = {
		mode: "fixed_servers",
		rules: {
			singleProxy: {
				host: host,
				port: port
			}
		}
	};
	
	if ($('#proxy_enabled').is(':checked')) {
		chrome.storage.sync.set({proxy_enabled: true}, null);
		chrome.proxy.settings.set({
			value: proxy_config,
			scope: 'regular'
		});

		$.notify({
				title: "<b>Success</b><br>",
				message: "Proxy settings saved."
			},
			{
				type: 'success',
				animate: {
					enter: 'animated fadeInDown',
					exit: 'animated fadeOutUp'
				},
				delay: 2000
			});
	}
	else {
		chrome.storage.sync.set({proxy_enabled: false}, null);
		chrome.proxy.settings.clear({
			scope: 'regular'
		});
	}
});