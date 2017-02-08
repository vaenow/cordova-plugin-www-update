/**
 * Logger.js
 */
	var utils = require("./Utils");

	var MSG_COUNT = 8;
	var messages = [];

	function Logger(msg, isShow) {
		console.log(msg);
		if(utils.isOnResumeUpdate()) return;
		
		utils.showProgressModal(isShow);
		//$('#myContainer').show();
		return;
		/*messages.push(msg);
		while (messages.length > MSG_COUNT) {messages.shift();}*/
		//document.getElementById("statusPlace").innerHTML = messages.join('<br/>');
		/*var _tr = $("#statusPlace>tbody>tr"),
			len = _tr.length,
			first = _tr.first(),
			clone = first.clone();
		clone.find('td').first().html(status || '-');
		clone.find('td').last().html(msg);
		clone.insertAfter(first);

		if (len > MSG_COUNT) {
			_tr.last().remove();
		}*/
		//scrollTo(0,document.body.scrollHeight);
	}

	module.exports = Logger;
