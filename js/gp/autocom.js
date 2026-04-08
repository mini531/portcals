/**
자동완성 목록 생성
**/
function initAutoComplet(){
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
   			"<a href='javascript:;' style='text-decoration: none;' onclick='javascript:selectAutoComQuery(\""+rowData+"\");\'>" +
   			"<font color='#4B4B4B' onmouseover=this.style.color='#00A0DD' onmouseout=this.style.color='#4B4B4B'>" +
   			tmpViewArray[i].trim() +
   			"</font></a></li>";
   }

   if(list != '') {
       $(".list_bx").html(list);
   }
}


/**
 * 내가 찾은 검색어 목록 선택
 **/
function selectAutoComQuery(query){
    $("#query").val(query);
    //$(".srch_inp").toggleClass("on");
    $("#divToggle").toggle();
}

/**
 * 내가 찾은 검색어 저장
 */
function saveSearchHistory(){
    var tmpCookieStr = "";
    var cookieCnt = 0;
    if($("#query").val() != ''){
        var keywordList = getDatList("SearchHistory");
        //중복 검색어 체크
        for(var i=0; i<keywordList.length; i++){
            if(unescape(keywordList[i]) != $("#query").val()){
                tmpCookieStr = tmpCookieStr + "---" + keywordList[i];
                cookieCnt ++;
            }

            //10개만 저장
            if(cookieCnt ==  9){
                break;
            }
        }

        tmpCookieStr = escape($("#query").val())+tmpCookieStr;

        setCookie("SearchHistory", tmpCookieStr);
    }
}

/**
자동완성이 열려 있으면 닫고 닫혀 있으면 열림
**/
function autoComOpenClose(){
   if($("#autoComLayer").css("display") == 'none'){
       autoComOpen();
   }else{
       //autoComClose();
   }
}
