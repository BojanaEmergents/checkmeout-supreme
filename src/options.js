// Saves options to chrome.storage
function save_options() {
	var name = document.getElementById("name").value;
	var email = document.getElementById("email").value;
	var phone = document.getElementById("phone").value;
	var address = document.getElementById("address").value;
	var city = document.getElementById("city").value;
	var zip = document.getElementById("zip").value;
	var state = document.getElementById("state").value;
	var country = document.getElementById("country").value;

	var card_type = document.getElementById("card_type").value;
	var card_no = document.getElementById("card_no").value;
	var expiry_month = document.getElementById("expiry_month").value;
	var expiry_year = document.getElementById("expiry_year").value;
	var cvv = document.getElementById("cvv").value;
	var any_size = document.getElementById("any_size").checked;
	var autoco = document.getElementById("autoco").checked;
	var tryagain = document.getElementById("tryagain").checked;
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
		city: city,
		zip: zip,
		state: state,
		country: country,

		card_type: card_type,
		card_no: card_no,
		expiry_month: expiry_month,
		expiry_year: expiry_year,
		cvv: cvv,
		any_size: any_size,
		autoco: autoco,
		tryagain: tryagain,
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
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 2000);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get({
		name: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		zip: '',
		state: '',
		country: '',

		card_type: '',
		card_no: '',
		expiry_month: '',
		expiry_year: '',
		cvv: '',
		any_size: '',
		autoco: '',
		tryagain: '',
		delay: '',

		kw_enabled: '',
		ar_enabled: '',
		start_time: '',
		category: '',
		keywords: '',
		colour: '',
		size: '',
		queue: '',
		//tc_accepted: ''
	}, 
	function(items) {
		document.getElementById('name').value = items.name;
		document.getElementById("email").value = items.email;
		document.getElementById("phone").value = items.phone;
		document.getElementById("address").value = items.address;
		document.getElementById("city").value = items.city;
		document.getElementById("zip").value = items.zip;
		document.getElementById("state").value = items.state;
		document.getElementById("country").value = items.country;

		document.getElementById("card_type").value = items.card_type;
		document.getElementById("card_no").value = items.card_no;
		document.getElementById("expiry_month").value = items.expiry_month;
		document.getElementById("expiry_year").value = items.expiry_year;
		document.getElementById("cvv").value = items.cvv;
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

		for (item in items.queue) {
			$('#queue-list').append($('<li class="list-group-item">').text(items.queue[item][0]+" / "+items.queue[item][1]+" / "+items.queue[item][2]));
		}
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

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

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
})

$('#keywords').on('input propertychange paste', function() {
	if (!$('#kw_enabled').is(':checked')) {
		$('#keywords').tooltip('show');
	}
	else {
		$('#keywords').tooltip('hide');
	}
});

$("#clear-shipping").click(function() {
	document.getElementById('name').value = "";
	document.getElementById("email").value = "";
	document.getElementById("phone").value = "";
	document.getElementById("address").value = "";
	document.getElementById("city").value = "";
	document.getElementById("zip").value = "";
	document.getElementById("state").value = "";
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
	document.getElementById("queue-list").innerHTML = "";
	queue_list = [];
});

var queue_list = [];

$('#add-queue').click(function() {
	var queue_name = $('#keywords')[0].value;
	var queue_colour = $('#colour')[0].value;
	var queue_size = $('#size')[0].value;
	$('#queue-list').append($('<li class="list-group-item">').text(queue_name+" / "+queue_colour+" / "+queue_size));

	var queue_item = [];
	queue_item.push(queue_name);
	queue_item.push(queue_colour);
	queue_item.push(queue_size);
	queue_list.push(queue_item);
});