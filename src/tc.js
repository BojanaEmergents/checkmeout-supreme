document.getElementById("save").disabled = !document.getElementById("tc_accepted").checked;
document.getElementById("tc_accepted").addEventListener("click", tc_button);

function tc_button() {
	document.getElementById('save').disabled = !document.getElementById("tc_accepted").checked;
}