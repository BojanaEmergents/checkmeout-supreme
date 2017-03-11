var t0 = performance.now();
var url_split = window.location.href.split("/");

var report = new Object();
report.timestamp = Date.now();
report.version = chrome.runtime.getManifest().version;
report.out = [];
report.err = [];

function log(message, type) {
	if (type == "out") {
		report.out.push(message);
	}
	else if (type == "err") {
		report.err.push(message);
	}
	else {
		console.log("Invalid message type.");
	}
	chrome.storage.sync.set({report: report}, null);
}

function findKeywordItem(current_item) {
	chrome.storage.sync.get({
		region: '',
		runnable: '',
		kw_enabled: '',
		category: '',
		keywords: '',
		colour: '',
		queue: ''
	}, 
	function(items) {
		if (!current_item) {
			log("Empty shopping list", "err");
			alert("No items in your shopping list!");
		}
		log('SEARCHING: '+current_item, "out");
		xhr = new XMLHttpRequest();

		if (current_item[0] == "jackets") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/jackets", false);}
		else if (current_item[0] == "shirts") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/shirts", false);}
		else if (current_item[0] == "tops_sweaters") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/tops_sweaters", false);}
		else if (current_item[0] == "sweatshirts") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/sweatshirts", false);}
		else if (current_item[0] == "pants") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/pants", false);}
		else if (current_item[0] == "shorts") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/shorts", false);}
		else if (current_item[0] == "t-shirts") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/t-shirts", false);}
		else if (current_item[0] == "hats") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/hats", false);}
		else if (current_item[0] == "bags") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/bags", false);}
		else if (current_item[0] == "accessories") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/accessories", false);}
		else if (current_item[0] == "skate") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/skate", false);}
		else if (current_item[0] == "shoes") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/shoes", false);}

		xhr.send();
		parser = new DOMParser();
		htmlDoc = parser.parseFromString(xhr.responseText,"text/html");
		articles = htmlDoc.getElementsByTagName("article");

		for (var i = 0; i < articles.length; i++) {
			var name = articles[i].childNodes[0].childNodes[1].childNodes[0].text;
			var color = articles[i].childNodes[0].childNodes[2].childNodes[0].text;

			if (name.toLowerCase().indexOf(current_item[1].toLowerCase()) != -1) {
				if (color.toLowerCase().indexOf(current_item[2].toLowerCase()) != -1) {
					var href = articles[i].childNodes[0].childNodes[0].getAttribute('href');
					window.location.href = "http://www.supremenewyork.com" + href;
				}
				else {
					log("No colour found: "+current_item[2]+" item: "+current_item[1], "err");
				}
			}
			else {
				log("No product found: "+current_item[1]+" in: "+current_item[0], "err");
			}
		}
	});
}

// if keyword enabled, run the item search
if (url_split[url_split.length-1] == "shop" || url_split[url_split.length-3] == "shop") {
	log("Ran on shop page", "out");
	chrome.storage.sync.get({
		region: '',
		runnable: '',
		kw_enabled: '',
		queue: '',
	}, 
	function(items) {
		if (items.kw_enabled && items.runnable && items.region != "jp") {
			findKeywordItem(items.queue[0]);
		}
	});
}

// if on item page, select size and navigate to checkout
// regex to verify 9 character alphanumeric string
if (window.location.href.includes("shop/") && /^([a-zA-Z0-9]{9})$/.test(url_split[url_split.length-1])) {
	log("Ran on item page", "out");
	chrome.storage.sync.get({
		region: '',
		kw_enabled: '',
		alt_size: '',
		queue: '',
		any_size: ''
	}, 
	function(items) {
		if (items.region != "jp" && items.kw_enabled) {
			// not sure why this is necessary but it is
			var size = items.queue[0][3];
			
			// add to basket, if size found, or if user said continue anyway (delay for jquery to load)
			// then either naviagte to check out or find next item
			var values = $.map($('#size option'), function(option) {
				return option.text;
			});

			// if the desired size is not in stock, alert the user
			// otherwise add it to basket
			if (values.indexOf(items.queue[0][3]) == -1 && items.any_size == false && items.queue[0][3] != 'One size') {
				log("Size not found", "err");
				alert("Size " + items.queue[0][3] + " not available. The bot will now halt.");
			}
			else {
				// select size
				setInterval(function() {
					if (!$('.in-cart').is(":visible")) {
						$("#size option").each(function(i) {
							if ($(this).text() == size) {
								$('#size').prop('selectedIndex', i);
							}
						});
					}
				}, 5);
				log("Added item to cart", "out");
				setInterval(function(){$("#add-remove-buttons").children("input:not(.remove)").click();}, 10);
			}

			// remove the current item from the queue then store 
			var remaining = items.queue;
			remaining.splice(0, 1);
			chrome.storage.sync.set({queue: remaining}, null);

			// if items remain, find next
			// else go to check out
			var t = setInterval(function() {
				if ($("#container").hasClass("has-cart")) {
					if (items.queue[0] != undefined) {
						findKeywordItem(items.queue[0]);
					}
					else {
						log("Navigated to checkout", "out");
						setTimeout(function(){window.location.href = "https://www.supremenewyork.com/checkout";}, 50);
					}
					clearInterval(t);
				}
			}, 10);
		}
		else {
			// select size (japan/no keywords)
			// add to basket, if size found, or if user said continue anyway (delay for jquery to load)
			// then either naviagte to check out or find next item
			var values = $.map($('#size option'), function(option) {
				return option.text;
			});

			// if the desired size is not in stock, alert the user
			// otherwise add it to basket
			if (values.indexOf(items.alt_size) == -1 && items.any_size == false && items.alt_size != 'One size') {
				log("Size not found", "err");
				alert("Size " + items.alt_size + " not available. The bot will now halt.");
			}
			else {
				setInterval(function() {
					if(!$('.in-cart').is(":visible")) {
						$("#size option").each(function(i) {
							if($(this).text() == items.alt_size) {
								$('#size').prop('selectedIndex', i);
							}
						});
					}
				}, 5);
				log("Added item to cart", "out");
				setInterval(function(){$("#add-remove-buttons").children("input:not(.remove)").click();}, 10);
			}

			// if items remain, find next
			// else go to check out
			var t = setInterval(function() {
				if ($("#container").hasClass("has-cart")) {
					log("Navigated to checkout", "out");
					setTimeout(function(){window.location.href = "https://www.supremenewyork.com/checkout";}, 50);
					clearInterval(t);
				}
			}, 10);
		}
	});
}

// if on checkout page, autofill data
if (window.location.href.includes("checkout")) {
	log("Ran on checkout page", "out");
	chrome.storage.sync.get({
		region: '',
		runnable: '',

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
		autoco: '',
		tryagain: '',
		delay: ''
	  }, 
	  function(items) {
	  	/*
		document.getElementById('order_billing_name').value = items.name;
		document.getElementById("order_email").value = items.email;
		document.getElementById("order_tel").value = items.phone;

		document.getElementById("bo").value = items.address;
		document.getElementById("order_billing_city").value = items.city;
		document.getElementById("order_billing_zip").value = items.zip;
		document.getElementById("order_billing_country").value = items.country;
		if (items.region == "us") {
			document.getElementById("order_billing_state").value = items.state;
		}

		document.getElementById("cnb").value = items.card_no;
		document.getElementById("credit_card_type").value = items.card_type;
		document.getElementById("credit_card_month").value = items.expiry_month;
		document.getElementById("credit_card_year").value = items.expiry_year;
		document.getElementById("vval").value = items.cvv;
		*/

		$("label").each(function(i) {
			// shipping info
			if ($(this).text() == "full name" || $(this).text() == "name") {
				document.getElementById($(this).attr('for')).value = items.name;
			}
			if ($(this).text() == "名前") {
				var a = $(this).attr('for');
				var b = document.getElementById(a).parentNode;
				b.childNodes[1].value = items.name.split(' ')[0];
				b.childNodes[2].value = items.name.split(' ')[1];
			}
			if ($(this).text() == "email" || $(this).text() == "Eメール") {
				document.getElementById($(this).attr('for')).value = items.email;
			}
			if ($(this).text() == "tel" || $(this).text() == "電話番号") {
				document.getElementById($(this).attr('for')).value = items.phone;
			}
			if ($(this).text() == "address" || $(this).text() == "住所") {
				document.getElementById($(this).attr('for')).value = items.address;
			}
			if ($(this).text() == "city" || $(this).text() == "区市町村") {
				document.getElementById($(this).attr('for')).value = items.city;
			}
			if ($(this).text() == "postcode" || $(this).text() == "zip" || $(this).text() == "郵便番号") {
				document.getElementById($(this).attr('for')).value = items.zip;
			}
			if ($(this).text() == "state") {
				document.getElementById($(this).attr('for')).value = items.state;
			}
			if ($(this).text() == "都道府県") {
				document.getElementById($(this).attr('for')).value = items.prefecture;
			}
			if ($(this).text() == "country") {
				document.getElementById($(this).attr('for')).value = items.country;
			}

			// payment info
			if ($(this).text() == "type" || $(this).text() == "支払い方法") {
				document.getElementById($(this).attr('for')).value = items.card_type;
			}
			if ($(this).text() == "exp. date" || $(this).text() == "有効期限") {
				var a = $(this).attr('for');
				var b = document.getElementById(a).parentNode;
				b.childNodes[1].value = items.expiry_month;
				b.childNodes[2].value = items.expiry_year;
			}
		});

		$("div").each(function(i) {
			// other awkward payment info
			if ($(this).text() == "number" || $(this).text() == "カード番号") {
				var a = $(this).attr('for');
				if (a != undefined) {
					document.getElementById(a).value = items.card_no;
				}
			}
			if ($(this).text() == "CVV" || $(this).text() == "CVV番号") {
				var a = $(this).attr('for');
				if (a != undefined) {
					document.getElementById(a).value = items.cvv;
				}
			}
		});

		if (document.getElementById("oba3") != null) {
			document.getElementById("oba3").value = items.address2;
		}
		if (document.getElementById("order_billing_address_3") != null) {
			document.getElementById("order_billing_address_3").value = items.address3;
		}

		// tick the t&c box
		document.getElementsByName("order[terms]")[1].parentElement.className = "icheckbox_minimal checked";
		document.getElementsByName("order[terms]")[0].checked = true;
		document.getElementsByName("order[terms]")[1].checked = true;

		if (items.autoco && items.runnable) {
			log("Checked out", "out");
			setTimeout(function(){document.getElementsByName("commit")[0].click();}, items.delay*1000);

			if (!items.tryagain) {
				chrome.storage.sync.set({runnable: false}, null);
			}
		}
	});
}
console.log((performance.now() - t0).toFixed(2) + " ms");