var t0 = performance.now();

var url_split = window.location.href.split("/");

function findKeywordItem() {
	chrome.storage.sync.get({
		region: '',
		runnable: '',
		kw_enabled: '',
		category: '',
		keywords: '',
		colour: ''
	}, 
	function(items) {
		xhr = new XMLHttpRequest();

		if (items.category == "jackets") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/jackets", false);}
		else if (items.category == "shirts") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/shirts", false);}
		else if (items.category == "tops_sweaters") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/tops_sweaters", false);}
		else if (items.category == "sweatshirts") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/sweatshirts", false);}
		else if (items.category == "pants") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/pants", false);}
		else if (items.category == "shorts") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/shorts", false);}
		else if (items.category == "t-shirts") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/t-shirts", false);}
		else if (items.category == "hats") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/hats", false);}
		else if (items.category == "bags") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/bags", false);}
		else if (items.category == "accessories") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/accessories", false);}
		else if (items.category == "skate") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/skate", false);}
		else if (items.category == "shoes") {xhr.open("GET", "http://www.supremenewyork.com/shop/all/shoes", false);}

		xhr.send();
		parser = new DOMParser();
		htmlDoc = parser.parseFromString(xhr.responseText,"text/html");
		articles = htmlDoc.getElementsByTagName("article");

		for (var i = 0; i < articles.length; i++) {
			var name = articles[i].childNodes[0].childNodes[1].childNodes[0].text;
			var color = articles[i].childNodes[0].childNodes[2].childNodes[0].text;

			if (name.toLowerCase().indexOf(items.keywords.toLowerCase()) != -1) {
				if (color.toLowerCase().indexOf(items.colour.toLowerCase()) != -1) {
					var href = articles[i].childNodes[0].childNodes[0].getAttribute('href');
					window.location.href = "http://www.supremenewyork.com" + href;
				}
				else {
					console.log("No colour found.");
				}
			}
			else {
				console.log("No product found.");
			}
		}
	});
}

// if keyword enabled, run the item search
if (url_split[url_split.length-1] == "shop" || url_split[url_split.length-3] == "shop") {
	chrome.storage.sync.get({
		region: '',
		runnable: '',
		kw_enabled: '',
	}, 
	function(items) {
	    if (items.kw_enabled && items.runnable && items.region != "jp") {
	    	// window.location.href = "https://supremenewyork.com/shop/all/" + items.category;
	    	findKeywordItem();
	    }
	});
}

// if on item page, select size and navigate to checkout
// regex to verify 9 character alphanumeric string
if (window.location.href.includes("shop/") && /^([a-zA-Z0-9]{9})$/.test(url_split[url_split.length-1])) {
	chrome.storage.sync.get({
		region: '',
		size: '',
		any_size: ''
	}, 
	function(items) {
		// select size		
		setInterval(function() {
				if(!$('.in-cart').is(":visible")) {
					$("#size option").each(function(i) {
						if($(this).text() == items.size) {
							$('#size').prop('selectedIndex', i);
						}
					});
				}
		}, 5);
	});

	// add to basket, if size found, or if user said continue anyway (delay for jquery to load)
	chrome.storage.sync.get({
		size: '',
		any_size: ''
	}, 
	function(items) {
		var values = $.map($('#size option') ,function(option) {
    		return option.text;
		});

		if (values.indexOf(items.size) == -1 && items.any_size == false && items.size != 'One size') {
			alert("Size " + items.size + " not available. The bot will now halt.");
		}
		else {
			setTimeout(function(){$("#add-remove-buttons").children("input:not(.remove)").click();}, 10);
		}
	});

	// go to checkout
	var t = setInterval(function() {
		if ($("#container").hasClass("has-cart")) {
			window.location.href = "https://www.supremenewyork.com/checkout";
			clearInterval(t);
		}
	}, 10);
}

// if on checkout page, autofill data
if (window.location.href.includes("checkout")) {
  	chrome.storage.sync.get({
  		region: '',

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
    	autoco: '',
    	delay: ''
	  }, 
	  function(items) {
	    document.getElementById('order_billing_name').value = items.name;
	    document.getElementById("order_email").value = items.email;
	    if (items.region == "us") {
	    	document.getElementById("order_tl").value = items.phone;
	    }
	    else {
	    	document.getElementById("order_tel").value = items.phone;
	    }
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
	    if (items.region == "us") {
	    	document.getElementById("cvw").value = items.cvv;
	    }
	    else {
	    	document.getElementById("vval").value = items.cvv;
	    }

	    document.getElementsByName("order[terms]")[1].parentElement.className = "icheckbox_minimal checked";
	    document.getElementsByName("order[terms]")[0].checked = true;
		document.getElementsByName("order[terms]")[1].checked = true;

		if (items.autoco) {
			setTimeout(function(){document.getElementsByName("commit")[0].click();}, items.delay*1000);
		}

		chrome.storage.sync.set({
			runnable: false
		},
		function() {});
	});
}
console.log((performance.now() - t0).toFixed(2) + " ms");