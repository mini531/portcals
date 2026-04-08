var formatUtils = {
	//파라미터에 3자리마다 콤마를 붙여서 반환한다.
	objToComma : function(obj){
		if(obj && obj != null){
			// 공개분류 숫자인 경우 숨김시 -999999999 표시
			if(obj.toString() == "-999999999")
				return "***";

			if ($.isNumeric(obj))
				return obj.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			else
				return obj;
		}else{
			return obj;
		}
	}
	//파라미터를 YYYY-MM-DD 형태로 반환한다.
	,addMinusChar : function(obj){
		if(obj && obj != null && obj.length === 8){

			if (obj == '********')
				return '****-**-**';
			else
				return obj.replace(/(\d{4})(\d{2})(\d{2})/,'$1-$2-$3');
		}else if(obj && obj != null && obj.length === 6){
			return obj.replace(/(\d{4})(\d{2})/,'$1-$2');
		}else{
			return this.objEmptyCheck(obj);
		}
	}
	//파라미터를 사업자번호 형태로 반환한다. xxx-xx-xxxxx 끝에 3자리는 숨김처리
	,addMinusCompNumber : function(obj){
		if(obj && obj != null){
			var replaceStr=obj.replace(/[^0-9]/g,'')
			if(replaceStr != null && replaceStr !== ''){
				if(replaceStr.length === 10){
					return replaceStr.substring(0,3)+'-'+replaceStr.substring(3,5)+'-'+replaceStr.substring(5,7)+'***';
				}else{
					return obj;
				}
			}else{
				return obj;
			}
		}else{
			return obj;
		}
	}
	//파라미터를 사업자번호 형태로 반환한다. xxx-xx-xxxxx
	,addMinusCompNumberNotHid : function(obj){
		if(obj && obj != null){
			var replaceStr=obj.replace(/[^0-9]/g,'')
			if(replaceStr != null && replaceStr !== ''){
				if(replaceStr.length === 10){
					return replaceStr.substring(0,3)+'-'+replaceStr.substring(3,5)+'-'+replaceStr.substring(5,10);
				}else{
					return obj;
				}
			}else{
				return obj;
			}
		}else{
			return obj;
		}
	}
	//파라미터를 전화번호 형태로 반환한다.
	,addPhoneChar : function(obj){
		if(obj && obj != null){

			if (obj == "***********")
				return "***-****-****";

			obj = obj.replace(/\D/g, "");
			var regExpPattern = /^([0-9]{3})\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/;
            if (obj.substr(0, 2) == "02") {
            	regExpPattern = /^([0-9]{2})\-?([0-9]{1,3})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/;
                if(obj.length > 9){
                    regExpPattern = /^([0-9]{2})\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/;
                }
            }else{
            	if(obj.length == 10){
            		regExpPattern = /^([0-9]{3})\-?([0-9]{1,3})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/;
            	}
            }
			var returnValue = obj.replace(regExpPattern, function (a, b) {
				var nval = [arguments[1]];
				if (arguments[2]) nval.push(arguments[2]);
				if (arguments[3]) nval.push(arguments[3]);
				if (arguments[4]) nval.push(arguments[4]);
				if (arguments[5]) nval.push(arguments[5]);
				return nval.join("-");
			});
			return returnValue;
		}else{
			return obj;
		}
	}
	,addIPaddress : function(obj){
		if(obj && obj != null){
		var val = obj.replace(/\D/g, "");
		var regExpPattern = /^([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\.([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])){3}$/;
		var returnValue = val.replace(regExpPattern, function (a, b) {
            var nval = [arguments[1]];
            if (arguments[2]) nval.push(arguments[2]);
            if (arguments[3]) nval.push(arguments[3]);
            if (arguments[4]) nval.push(arguments[4]);
            return nval.join(".");
        });
		return returnValue;
		}else{
			return obj;
		}
	}
	,addZipCode : function(obj){
		if(obj && obj != null){
			var replaceStr=obj.replace(/[^0-9]/g,'')
			if(replaceStr != null && replaceStr !== ''){
				if(replaceStr.length === 6){
					return replaceStr.substring(0,3)+'-'+replaceStr.substring(3,6);
				}else{
					return obj;
				}
			}else{
				return obj;
			}
		}else{
			return obj;
		}
	}
	,addBudgetCode : function(obj){
		if(obj && obj != null){
			var replaceStr=obj.replace(/[^0-9]/g,'')
			if(replaceStr != null && replaceStr !== ''){
				if(replaceStr.length === 25){
					return replaceStr.substring(0, 3) + ' ' + replaceStr.substring(3, 6) + ' '
					+ replaceStr.substring(6, 10) + ' ' + replaceStr.substring(10, 14) + ' '
					+ replaceStr.substring(14, 17) + ' ' + replaceStr.substring(17, 20) + ' '
					+ replaceStr.substring(20, 25);
				}else{
					return obj;
				}
			}else{
				return obj;
			}
		}else{
			return obj;
		}
	}
	,objEmptyCheck : function(obj){
		return !obj ? "" : obj;
	}
	,isEmptyObject : function(obj){
		if( obj == "" || obj == null || obj == undefined || ( obj != null && typeof obj == "object" && !Object.keys(obj).length ) ){
			return true;
		}else{
			return false;
		}

	}
	,escapeHtml : function(text) {
		if(text){
			return text.toString().replace(/[\"&<>]/g, function (a) {
				return {
					'"': '&quot;',
					'&': '&amp;',
					'<': '&lt;',
					'>': '&gt;'
				}[a];
			});
		} else{
			return '';
		}
	}
	,escapeXss : function(text) {
		if(text){
			return text.toString().replace(/[<>&\s\'\"\(\)\{\};]/g, function (a) {
				return {
					'<' : '&lt;',
					'>' : '&gt;',
					'&' : '&amp;',
					' ' : '&nbsp;',
					'\'' : '&apos;',
					'"' : '&quot;',
					'(' : '',
					')' : '',
					'{' : '',
					'}' : '',
					';' : ''
				}[a];
			});
		} else{
			return '';
		}
	}
	,escapeSQL : function(text) {
		if(text){
			return text.toString().replace(/[\=\-\s\'\(\);]/gi, '');
		} else{
			return '';
		}
	}
	,escapeEditorHtmlTag : function(text) {
		return text;
		// 줄바꿈문자,?,&,/,<,>, 공백
		if(text){
			return text.toString().replace(/[\n\r\t\?&\/<>\s]/g, function (a) {
				return {
					'\n': '',
					'\r': '',
					'\t': '',
                    '?' : '&#63;',
                    '&' : '&amp;',
                    '/' : '&#47;',
					'<': '&lt;',
					'>': '&gt;',
                    ' ' : '&nbsp;'
				}[a];
			});
		} else {
			return '';
		}
	}
	,unescapeEditorHtmlTag : function(text) {
		if(text){
			return text.toString()
					.replace(/&#63;/g, "?")
					.replace(/&amp;/g, "&")
					.replace(/&#47;/g, "/")
					.replace(/&lt;/g, "<")
					.replace(/&gt;/g, ">")
					.replace(/&nbsp;/g, " ")
					.replace(/&apos;/g, "\'")
					.replace(/&quot;/g, "\"");
		} else {
			return '';
		}
	}
};
