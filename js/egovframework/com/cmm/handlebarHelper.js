Handlebars.registerHelper('select', function( value, options ){
    var $el = $('<select />').html( options.fn(this) );
    $el.find('[value="' + value + '"]').attr('selected', 'selected');
    return $el.html();
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
	
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
		case 'isEmpty':
			return (v1 === null || v1 === '' || v1 === undefined ) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
Handlebars.registerHelper('isNotEmpty', function (obj) {
	
	if(obj && obj != null && obj != ''){
		return true;
	}else{
		return false;
	}
});

Handlebars.registerHelper('isEmpty', function (obj) {
	if(!obj || obj == null || obj == ''){
		return true;
	}else{
		return false;
	}
});

Handlebars.registerHelper("rownum", function(value, options)
{
    return parseInt(value) + 1;
});

Handlebars.registerHelper('eachIncludeParent', function ( context, options ) {
    var fn = options.fn,
        inverse = options.inverse,
        ret = "",
        _context = [];
        $.each(context, function (index, object) {
            var _object = $.extend({}, object);
            _context.push(_object);
        });
    if ( _context && _context.length > 0 ) {
        for ( var i = 0, j = _context.length; i < j; i++ ) {
            _context[i]["parentContext"] = options.hash.parent;
            ret = ret + fn(_context[i]);
        }
    } else {
        ret = inverse(this);
    }
    return ret;
});

//파라미터에 3자리마다 콤마를 붙여서 반환한다. 
Handlebars.registerHelper("objToComma", function(obj, options)
{
	if(obj && obj != null){	
		
		// 공개분류 숫자인 경우 숨김시 -999999999 표시
		if(obj.toString() == "-999999999")
			return "***";			
		
		return ax5.util.number(obj,{money:true});
	}else{
		return obj;
	}
});

//파라미터에 3자리마다 콤마를 붙여서 반환한다. 
Handlebars.registerHelper("objToComma2", function(obj, options)
{
	if(obj && obj != null){
		
		// 공개분류 숫자인 경우 숨김시 -999999999 표시
		if(obj.toString() == "-999999999")
			return "***";			
		
		if ($.isNumeric(obj))
			return ax5.util.number(obj,{money:true});
		else
			return obj;
	}else{
		return obj;
	}
});

//파라미터를 YYYY-MM-DD 형태로 반환한다.
Handlebars.registerHelper("addMinusChar", function(obj, options)
{	
	if(options && options !=null && typeof options != "object"){
		if(obj && obj != null && options === 8){			
			if (obj == '********') 
				return '****-**-**';

			return ax5.util.date(obj,{'return' : "yyyy-MM-dd"});
		}else if(obj && obj != null && options === 6){
			return ax5.util.date(obj,{'return' : "yyyy-MM"});
		}else{
			return obj;
		}
	}else {
		if(obj && obj != null && obj.length === 8){			
			if (obj == '********') 
				return '****-**-**';

			return ax5.util.date(obj,{'return' : "yyyy-MM-dd"});
		}else if(obj && obj != null && obj.length === 6){
			return ax5.util.date(obj,{'return' : "yyyy-MM"});
		}else{
			return obj;
		}
	}
});

//파라미터를 사업자번호 형태로 반환한다. xxx-xx-xxxxx
Handlebars.registerHelper("addMinusCompNumber", function(obj, options)
{
	if(obj && obj != null){
		var replaceStr=obj.replace(/[^0-9]/g,'')
		if(replaceStr != null && replaceStr !== ''){
			if(replaceStr.length === 10){
				return replaceStr.substring(0,3)+'-'+replaceStr.substring(3,5)+'-'+replaceStr.substring(5,7) +'***';
			}else{
				return obj;
			}
		}else{
			return obj;
		}
	}else{
		return obj;
	}
});

//파라미터를 전화번호 형태로 반환한다.
Handlebars.registerHelper("addPhoneChar", function(obj){
	if(obj && obj != null){
		
		if (obj == "***********")
			return "***-****-****";
		
		obj = obj.replace(/\D/g, "");
		var regExpPattern3 = /^([0-9]{3})\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/;
		if (obj.substr(0, 2) == "02") {
			regExpPattern3 = /^([0-9]{2})\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?\-?([0-9]{1,4})?/;
		}
		
		var returnValue = obj.replace(regExpPattern3, function (a, b) {
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
});

//파라미터를 우편번호 형태로 반환한다. xxx-xxx or xxxxx
Handlebars.registerHelper("addZipCode", function(obj, options)
{
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
});