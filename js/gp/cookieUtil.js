/*********************************************************************
 *
 *  cookie 공통 모듈 
 *
 *********************************************************************/
/**
  * 쿠키정보 가져오기 
  * @param name  쿠키명
  */
function getCookie(name) { 
	var Found = false; 
	var start, end;
	var i = 0;
	var cookieData = document.cookie;
	while(i <= cookieData.length) { 
	  	start = i; 
	 	end = start + name.length;
		  
	 	if(cookieData.substring(start, end) == name) { 
	   		Found = true; 
	   		break; 
	  	} 
	  	i++; 
	} 
	if(Found == true) { 
	  	start = end + 1; 
	  	end = cookieData.indexOf(";", start); 
	  	if(end < start) 
	   		end = cookieData.length; 
		  	return unescape(cookieData.substring(start, end)); 
		 } 
				 
	return ""; 
}

/**
 * 쿠키 설정
 * @param cookieName 쿠키명
 * @param cookieValue 쿠키값
 * @param expireDay 쿠키 유효날짜
 */
function setCookie( cookieName, cookieValue){
 	var today = new Date();
 	today.setDate( today.getDate() + 365 );   // 저장 기간 
 	document.cookie = cookieName + "=" +  escape(cookieValue)  + "; path=/; expires=" + today.toGMTString() + ";";
}


/**********************************************************************
 *
 *  Unicode ⇔ UTF-8
 *
 **********************************************************************/

function toUtf8(s) {
  var c, d = "";
  for (var i = 0; i < s.length; i++) {
    c = s.charCodeAt(i);
    if (c <= 0x7f) {
      d += s.charAt(i);
    } else if (c >= 0x80 && c <= 0x7ff) {
      d += String.fromCharCode(((c >> 6) & 0x1f) | 0xc0);
      d += String.fromCharCode((c & 0x3f) | 0x80);
    } else {
      d += String.fromCharCode((c >> 12) | 0xe0);
      d += String.fromCharCode(((c >> 6) & 0x3f) | 0x80);
      d += String.fromCharCode((c & 0x3f) | 0x80);
    }
  }
  return d;
}

function fromUtf8(s) {
  var c, d = "", flag = 0, tmp;
  for (var i = 0; i < s.length; i++) {
    c = s.charCodeAt(i);
    if (flag == 0) {
      if ((c & 0xe0) == 0xe0) {
        flag = 2;
        tmp = (c & 0x0f) << 12;
      } else if ((c & 0xc0) == 0xc0) {
        flag = 1;
        tmp = (c & 0x1f) << 6;
      } else if ((c & 0x80) == 0) {
        d += s.charAt(i);
      } else {
        flag = 0;
      }
    } else if (flag == 1) {
      flag = 0;
      d += String.fromCharCode(tmp | (c & 0x3f));
    } else if (flag == 2) {
      flag = 3;
      tmp |= (c & 0x3f) << 6;
    } else if (flag == 3) {
      flag = 0;
      d += String.fromCharCode(tmp | (c & 0x3f));
    } else {
      flag = 0;
    }
  }
  return d;
}

/**
 * 목록 가져오기 
 * return : list1[]
 */
function getDatList(dataId){
	var list =  "";	
	
	if (navigator.appName.charAt(0) == 'N') {
		list = fromUtf8(getCookie(dataId));
	} else if (navigator.appName.charAt(0) == 'M') {
		list = getCookie(dataId);
	}	
	if(list.length>0){
		list =  list.split("---");
	}else{
		list = "";
	}
	return list;
}

/**
 * 등록  
 */
function setDatList(dataId, url, title){

	if(title != ""){
		//1.목록 가져오기 
		var datList = getDatList(dataId);
		var tempData = "";
		var first = 0;
		var uName = "";
		if(datList.length > 0){
			//2. 중복자료 검사
			var preSavedUrl = "";
			var preSavedTitle = ""; 
			var temp = "";
		 
			for(var i = 0; i < datList.length; i++){
				temp = datList[i].split("--");
				preSavedUrl = temp[0].substring(4);
				preSavedTitle = temp[1].substring(6);
				
				if(preSavedUrl == url){
					//alert(preSavedUrl); 최상위로 올림 
					//return false;
					 
				}else{
					// 2-1 데이터 저장 
					if(tempData == ""){
							uName = 'url=';
					}else{
							uName = '---url=';	
					}
					if (navigator.appName.charAt(0) == 'N') {
						tempData += uName + toUtf8(preSavedUrl) + '--title=' + toUtf8(preSavedTitle);
					} else if (navigator.appName.charAt(0) == 'M') {
						tempData += uName + preSavedUrl + '--title=' + preSavedTitle;
					}
				}
			}
		}
		else{
			first = 1;
		}
		 
		//3. 등록  
		//alert(mode+"---"+datList.length);
		if(first==1){
			uName = 'url=';
		}
		else{
			uName = tempData + '---url=';	
		}
		
		if (navigator.appName.charAt(0) == 'N') {
			setCookie(dataId, uName + toUtf8(url) + '--title=' + toUtf8(title));
		}
		else if (navigator.appName.charAt(0) == 'M') {
			setCookie(dataId, uName + url + '--title=' + title);
		}
		
		//alert(datList.length);
		if(datList.length > 20){		// 저장 개수 설정 
			delDatList(dataId, 1);
		}
	}
	 
}