/*

http://secure-gl.imrworldwide.com/cgi-bin/m?ci=nlsnci614&am=3&at=view&rt=banner&st=image&ca=nlsn31593&cr=crtve&pc=yume_plc0001&ce=yume&r=[timestamp]
http://secure-gl.imrworldwide.com/cgi-bin/m?ci=nlsnci307&am=4&at=view&rt=banner&st=image&ca=nlsn31351&cr=creative&pc=Placement1_$domain&ce=yume&r=[timestamp]
https://secure-gl.imrworldwide.com/cgi-bin/m?ci=nlsnci307&am=4&at=view&rt=banner&st=image&ca=nlsn31351&cr=creative&pc=Placement1_$domain&ce=yume&r=[timestamp]

original replacement function is terrible:

temp_pixel.replace('r=[timestamp]','c8=devgrp,${device_grouping}&c9=devid,${device_id}&c10=plt,${device_platform}&c13=asid,PF8F82B8C-03AD-D147-E040-070AAD31389C&r=${rand}');


*/

var mocr = (function($){

	var tag = "";

	// additional query strings to be appended

	var context = {};
	// initial params
	context.initial_tag = "";
	context.base_tag = "";
	context.currentQueryFields = [];
	context.fields_to_modify = [];
	context.fields_to_remain = [];
	context.fields_final = [];
	context.final_tag = "";
	// default params to be added
	var fields_to_modify = [];
	// found fields in original tag to be ignored
	var fields_to_remain = [];
	// final fields to from which the build function will work on
	var fields_final = [];


	function _init() {
		_reset();
		_addFieldToModificationGroup("c8", "devgrp,${device_grouping}");
		_addFieldToModificationGroup("c9", "devid,${device_id}");
		_addFieldToModificationGroup("c10", "plt,${device_platform}");
		_addFieldToModificationGroup("c13", "asid,PF8F82B8C-03AD-D147-E040-070AAD31389C");


	}

	function _reset() {
	context.base_tag = "";
	context.currentQueryFields = [];
	context.fields_to_modify = [];
	context.fields_to_remain = [];
	context.fields_final = [];
	context.final_tag = "";
	fields_to_modify = [];
	fields_to_remain = [];
	fields_final = [];
	}

	function _addFieldToModificationGroup(field, value) {

		fields_to_modify.push({query_string_field: field, query_string_value: value});
		//console.log(fields_to_modify);
	}

	function _splitQueryStrings() {
		context.base_tag = tag.substring(0, tag.indexOf("?"));
		var tag_modified = tag.substring(tag.indexOf("?") + 1);
		var query_string_array = tag_modified.split("&");
		for (x=0; x < query_string_array.length; x++) {
			modified_query_value = query_string_array[x].substring(query_string_array[x].indexOf("=") + 1);
			//console.log(modified_query_value);
			modified_query_string_field = query_string_array[x].substring(0, query_string_array[x].indexOf('='));
			context.currentQueryFields.push({query_string_field: modified_query_string_field, query_string_value: modified_query_value});
		}
		//console.log(context.currentQueryFields);

	}

	function _buildParameters() {	

		for (x = 0; x < context.currentQueryFields.length; x++) {
			fields_final.push(context.currentQueryFields[x]);
		}

		for (y = 0; y < fields_to_modify.length; y++) {
			for (z = 0; z < fields_to_remain.length; z++) {
				if (fields_to_remain[z] == fields_to_modify[y]) {
					var sliced_and_diced = fields_to_modify.splice(y,1);
				} 
			}
		}

		for (n = 0; n < fields_to_modify.length; n++) {
			fields_final.push(fields_to_modify[n]);
		}
		context.fields_to_remain = fields_to_remain;
		context.fields_to_modify = fields_to_modify;
		context.fields_final = fields_final;

	}

	function _writeTag() {

		context.final_tag = context.base_tag + "?";
		for (x = 0; x < fields_final.length; x++) {
			context.final_tag += fields_final[x].query_string_field + "=" + fields_final[x].query_string_value;
			if (x != (fields_final.length -1)) {
				context.final_tag += "&"; 
			}

		}
		context.final_tag
	}

	function _validateTag() {
		// check fields_to_modify to see if any of those fields exist in currentQueryFields
		// if they don't, pass it
		// if they do, add it to fields_to_remain because we'll echo it to the user
		for(x=0; x < context.currentQueryFields.length; x++ ) {
			for(y=0; y < fields_to_modify.length; y++) {
				if (context.currentQueryFields[x].query_string_field == fields_to_modify[y].query_string_field) {
					fields_to_remain.push(fields_to_modify[y]);
				}
			}
		}

	}

	function _setTag(url) {
		context.initial_tag = url;
		tag = url;
	}

	function _writeScreen() {
		var source   = $("#entry-template").html();
		var template = Handlebars.compile(source);
		var html    = template(context);
		$('#main').html(html);
	}

	return {
		init: _init,
		start: _splitQueryStrings,
		updateScreen: _writeScreen,
		setTag: _setTag,
		validate: _validateTag,
		buildTag: _buildParameters,
		writeTag: _writeTag

	}

})(jQuery);

$(document).ready(function(){
	$("#go").click(function(){
	var inputted_tag = $('#input').val();
	mocr.setTag(inputted_tag);
	
	mocr.init();
	mocr.start();
	mocr.validate();
	mocr.buildTag();
	mocr.writeTag();
	mocr.updateScreen();

	})

});



