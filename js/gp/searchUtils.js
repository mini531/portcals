var searchUtils = {
		
	//통합검색 화면 호출
	itgSearchVw : function (searchKwrd){
		var keyword = $.trim(searchKwrd);	
		var params = [{name : "keyword" , value : keyword}];
		commonUtils.pageSubmit({
			url : "/kc/searchList.do"
		   ,data : params
		});
	},	
	//검색어 검사
	keyWordCheck : function(searchKwrd, requestId){
		var keyword = $.trim(searchKwrd);
		
		if (!keyword) {
			commonUtils.alert({ title: '입력값을 확인해 주세요', msg: '검색어는 필수입력 값 입니다.', theme: 'warning' }, function(){
				if (requestId) {
					$(requestId).focus();
				}
			});
			return false;
		} else if (keyword.length < 2) {	
			commonUtils.alert({ title: '입력값을 확인해 주세요', msg: '검색어는 최소 두자 이상 입력하셔야 합니다.', theme: 'warning' }, function(){
				if (requestId) {
					$(requestId).focus();
				}				
			});
			return false;
		}
	
		return true;
	},
	/**
	자동완성 목록 생성
	**/
	initAutoComplet : function(focustCls, searchKeyId, toggleBoxId){
	   var viewlen = 200;
	   var keywordList = getDatList("SearchHistory");
	   if( keywordList.length == 0 ) return;

	   var keywordCnt = keywordList.length;
	   var tmpViewArray = new Array(keywordCnt);
	   var tmpDataArray = new Array(keywordCnt);
	   var quot = "\"";
	   var replaceQuot = "&quot;";
	   var rowData = "";
	  
	   for(var i = 0; i < keywordCnt; i ++) {
	       if( keywordList[i].length > viewlen/2 ) {
	       	tmpViewArray[i] = unescape(keywordList[i]).substr(0,28) + "...";
	       	tmpDataArray[i] = unescape(keywordList[i]);
	       } else {
	       	tmpViewArray[i] = unescape(keywordList[i]);
	       	tmpDataArray[i] = unescape(keywordList[i]);
	       }
	   }
		
	   var list = "";
		
	   for (var i = 0; i < tmpViewArray.length ; i++) {
	   	rowData = tmpDataArray[i].trim().split(quot).join(replaceQuot);
			rowData = rowData.replace("/\'/gi", "\\'");
	   	list += "<li>" +
	   			"<a href='javascript:;' style='text-decoration: none;' onclick='javascript:searchUtils.selectAutoComQuery(\""+searchKeyId+"\",\""+toggleBoxId+"\",\""+rowData+"\");\'>" +
	   			"<font color='#4B4B4B' onmouseover=this.style.color='#00A0DD' onmouseout=this.style.color='#4B4B4B'>" +
	   			formatUtils.escapeHtml(tmpViewArray[i].trim()) +
	   			"</font></a></li>";
	   }

	   if(list != '') {
	       $(focustCls).html(list);
	   }
	},
	//내가 찾은 검색어 목록 선택
	selectAutoComQuery : function(searchKeyId, toggleBoxId, query){
		$(searchKeyId).val(query);
	    $(toggleBoxId).toggle();
	},
	//내가 찾은 검색어 저장
	saveSearchHistory : function(searchKwrd){
		var tmpCookieStr = "";
	    var cookieCnt = 0;
	    var keyword = $.trim(searchKwrd);
	    if(keyword != ''){
	        var keywordList = getDatList("SearchHistory");
	        //중복 검색어 체크
	        for(var i=0; i<keywordList.length; i++){
	            if(unescape(keywordList[i]) != keyword){
	                tmpCookieStr = tmpCookieStr + "---" + keywordList[i];
	                cookieCnt ++;
	            }

	            //10개만 저장
	            if(cookieCnt ==  9){
	                break;
	            }
	        }

	        tmpCookieStr = escape(keyword)+tmpCookieStr;

	        setCookie("SearchHistory", tmpCookieStr);
	    }
	}
	
	
}