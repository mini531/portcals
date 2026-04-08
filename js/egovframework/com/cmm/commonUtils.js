var commonUtils = {
	//JSON 문자열을 자바스크립트 오브젝트로 변환
	convertJsonToObj : function(str){
		if(str == null || str == ''){
			return {};
		}else{
			try{
				str = str.replace(/\r/gi, '\\r').replace(/\n/gi, '\\n').replace(/\t/gi, '\\t').replace(/\f/gi, '\\f').replace(/[\u0000-\u001F|\u0080-\u10FF|\u1200-\u312F|\u3190-\uABFF|\uD7A4-\uFFFF]/gi, '');
				return JSON.parse(str);
			}catch(e){
				return {};
			}
		}
	},
	convertJsonToStr: function(str){
		if(str == null || str == ''){
			return {};
		}else{
			try{
				str = str.replace(/\r/gi, '\\r').replace(/\n/gi, '\\n').replace(/\t/gi, '\\t').replace(/\f/gi, '\\f').replace(/[\u0000-\u001F|\u0080-\u10FF|\u1200-\u312F|\u3190-\uABFF|\uD7A4-\uFFFF]/gi, '');
				return JSON.stringify(str);
			}catch(e){
				return {};
			}
		}
	},
	//로딩 마스크 처리
	showMask : function(target){
		if (!target) {
			$.busyLoadFull("show", {
				fontawesome: "fa fa-cog fa-spin fa-3x fa-fw"
			});
		} else {
			target.busyLoad("show", {
				fontawesome: "fa fa-cog fa-spin fa-3x fa-fw"
			});
		}
	},
	closeMask : function(target) {
		if (!target) {
			$.busyLoadFull("hide");

			// ajax 권한 에러시 body의 busyLoadFull data를 제거해서 문제 발생. 직접 로딩 지워줌
			if($("body").find(".busy-load-container").length > 0)
				$("body").find(".busy-load-container").remove();
		} else {
			target.busyLoad("hide");

			// ajax 권한 에러시 target의 busyLoadFull data를 제거해서 문제 발생. 직접 로딩 지워줌
			if(target.find(".busy-load-container").length > 0)
				target.find(".busy-load-container").remove();
		}
	},
	//공통Ajax
	ajax : function(options){
		if(!options){alert('정의된 속성이 없습니다.\nurl, success 속성을 정의해주세요');return false;}
		if(!options.url){alert('url 속성을 정의해주세요');return false;}
		if(!options.success){alert('success 속성을 정의해주세요');return false;}

		var jsonRequestChk=false;
		if(options.data){
			if(typeof options.data === 'string'){
				if(options.data.startsWith("{") || options.data.startsWith("["))
					jsonRequestChk=true;
			}
		}

		var headerOption =
		{
		    "Accept": "text/plain; charset=utf-8"
		    ,"Content-Type": jsonRequestChk?"application/json; charset=UTF-8":"application/x-www-form-urlencoded; charset=UTF-8"
		}

		if(options.dataType){
			var dataType=options.dataType.toLowerCase();
			switch(dataType){
				case 'json' :
					headerOption = {
					    "Accept": "text/plain; charset=utf-8"
						,"Content-Type": jsonRequestChk?"application/json; charset=UTF-8":"application/x-www-form-urlencoded; charset=UTF-8"
					}
					break;
				case 'html' :
					headerOption = {
					    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
					    ,"Content-Type": jsonRequestChk?"application/json; charset=UTF-8":"application/x-www-form-urlencoded; charset=UTF-8"
					}
					break;
				default :break;
			}
		}
		var ajaxOptions={};

		ajaxOptions=$.extend({
			  	headers: headerOption,
				type : "POST",                     // GET 또는 POST
				dataType : 'json',               // html , javascript, text, xml, json, jsonp 등이 있다
				async: true,				//동기, 비동기 처리 false==동기방식 기본값  true
				beforeSend: function(xmlHttpRequest) {      // ajax 요청하기전에 실행되는 함수
					xmlHttpRequest.setRequestHeader("AJAX", "true");
					commonUtils.showMask(options.maskTarget);
				},error : function(xhr, status, error, request ) {
					var statusCode=xhr.status;
					var theme='error';
					var title='오류발생';
					switch(statusCode){
						case 5103 :
							// 인터셉트에서 ajax 호출시 5103 보냄
							location.href = "/";
							commonUtils.closeMask(options.maskTarget);
							return;
						case 401 :
							title='[로그인을 해주세요]';
							break;
						case 403 :
							title='[해당 요청을 수행할 수 있는 권한이 없습니다]';
							break;
						case 423 :
							title='[해당 서비스는 준비중입니다.]';
							break;
					}

					if(xhr.responseJSON){
						var msg=JSON.parse(xhr.responseText);
						if(msg.msg){
							msg=msg.msg;
						}else if(msg.message){
							msg=msg.message;
						}else{
							msg=msg;
						}
						if(xhr.responseJSON.messageType){
							theme='error';
							title='알림';
						}else if(xhr.responseJSON.validResponse){
							theme='warning';
							title='알림 : [서버에서 입력값 확인을 요청합니다.]';
						}
						commonUtils.alert({
							theme : theme
							,title : title
							,msg : msg
						}, function(){
		            		if(options.errorCallback){
		            			options.errorCallback(xhr, status, error);
		            		}
						})
					}else{
						commonUtils.alert({
							theme : theme
							,title : title
							,msg: xhr.statusText
						}, function(){
		            		if(options.errorCallback){
		            			options.errorCallback(xhr, status, error);
		            		}
						})
					}

					commonUtils.closeMask(options.maskTarget);

				},complete : function () {
					commonUtils.closeMask(options.maskTarget);
				}
			},options);
		$.ajax(ajaxOptions);
	},
	//Grid 옵션
	grid : function(options){
		if(!options){alert('정의된 속성이 없습니다.\ntarget, columns 속성을 정의해주세요123');return false;}
		if(!options.target){alert('target 속성을 정의해주세요');return false;}
		if(!options.colModel){alert('colModel 속성을 정의해주세요');return false;}

		if (options.cursor) {
			$(options.target).css("cursor", options.cursor);
		}

		var gridOptions={};
		var gridOptions=$.extend({
			mtype:'POST',
			datatype:'json',
			rowNum : 10,
			rownumbers: false,
			loadonce : false,
	     	viewrecords: false,
	     	height : 'auto',
	     	emptyrecords: '데이터가 없습니다.',
	     	multiselect:false,
	     	page: '1',
	     	pginput : true,
        	loadBeforeSend:function(xhr){
        		xhr.setRequestHeader("AJAX", "true");
        	},
        	loadError:function(xhr, status, error){
				var statusCode=xhr.status;
				var theme='error';
				var title='오류발생';
				switch(statusCode){
					case 5103 :
						// 인터셉트에서 ajax 호출시 5103 보냄
						location.href = "/";
						return;
					case 401 :
						title='[로그인을 해주세요]';
						break;
					case 403 :
						title='[해당 요청을 수행할 수 있는 권한이 없습니다]';
						break;
					case 423 :
						title='[해당 서비스는 준비중입니다.]';
						break;
				}

				if(xhr.responseJSON){
					var msg=JSON.parse(xhr.responseText);
					if(msg.msg){
						msg=msg.msg;
					}else if(msg.message){
						msg=msg.message;
					}else{
						msg=msg;
					}
					if(xhr.responseJSON.messageType){
						theme='error';
						title='알림';
					}else if(xhr.responseJSON.validResponse){
						theme='warning';
						title='알림 : [서버에서 입력값 확인을 요청합니다.]';
					}
					commonUtils.alert({
						theme : theme
						,title : title
						,msg : msg
					}, function(){
	            		if(options.errorCallback){
	            			options.errorCallback(xhr, status, error);
	            		}
					})
				}else{
					commonUtils.alert({
						theme : theme
						,title : title
						,msg: xhr.statusText
					}, function(){
	            		if(options.errorCallback){
	            			options.errorCallback(xhr, status, error);
	            		}
					})
				}
        	},
		},options);

        if(gridOptions.colModel){

        	$.each(gridOptions.colModel, function(i,v){
    			if(v.required){
    				v.label +="<span class='txt_red'>*</span>";
				}
        	});
        }

        return $(options.target).jqGrid(gridOptions);
	},
	gridSearch:function(target, searchOptions){
		if(!searchOptions){alert('정의된 검색 속성이 없습니다.\ntarget, columns 속성을 정의해주세요123');return false;}
		if(!target){alert('target 속성을 정의해주세요');return false;}

		var gridOptions =$(target).jqGrid('getGridParam');
		searchOptions=$.extend(gridOptions,searchOptions);
		$(target).setGridParam(searchOptions).trigger('reloadGrid');

	},
	//Grid 목록에 데이터가 없을시 처리
	gridListEmptyMsg : function(options){
		if(!options){alert('정의된 속성이 없습니다.\ntarget 속성을 정의해주세요');return false;}
		if(!options.target){alert('target 속성을 정의해주세요');return false;}

		var gridListEmptyMsgOptions=$.extend({
			msg : '데이터가 존재하지 않습니다.'
			,toast : false
		},options);

		var $gridTable = gridListEmptyMsgOptions.target;
		var msg = gridListEmptyMsgOptions.msg;
		var id = "jqGrid_noData" + "_" + $gridTable.attr('id');

		var colspan=$gridTable.find("tbody tr:eq(0) td").length

		$(id).remove();
		$gridTable.find("tbody").first().append("<tr id='" + id + "'><td align='center' colspan='" + colspan + "'><p style='margin-top:5px; font-weight:bold;'>" + msg + "</p></td></tr>");

		if(gridListEmptyMsgOptions.toast){
			commonUtils.toast({
				theme:'default'
				,msg:gridListEmptyMsgOptions.msg
			});
		}

		return "#" + id;
	}
	//그리드 유효성 검증
	,gridValidator : function(gridObj,tabValidInfo){
		if(!gridObj && girdObj === null){alert('그리드 오브젝트가 존재하지 않습니다.');return false;}

		var validResult=false;
		var requiredArr=[];
		var requiredLabelArr=[];
		var requiredColIndex=[];
		var rex = /<span style='txt_red'>[^>]*>/g
		var colModel = gridObj.getGridParam("colModel");
		$.each(colModel, function(i, v) {
			if (v.required === true) {
				requiredArr.push(v.name);
				requiredLabelArr.push(v.label);
				requiredColIndex.push(i);
			}
		});

		var gridRowIds = gridObj.getDataIDs();
		$.each(gridRowIds, function(i, rowId){
			var rowData = gridObj.getRowData(rowId);

			$.each(rowData, function(key, data){

				var index = requiredArr.indexOf(key);

				if (index !== -1) {
					if (data === null || data === '') {
						validResult = true;
						var label = requiredLabelArr[index];
						commonUtils.alert({
							title : '입력값을 확인해 주세요.'
							,msg : label.replace(rex , "")+' 은/는 필수입력 값 입니다.'
							,theme : 'warning'
						}, function(){
							gridObj.editCell(i+1, requiredColIndex[index], true);
						});
						return false;
					}
				}
			});

			if(validResult)return false;
		});

		return !validResult
	},
	//다중 셀렉트 박스 생성
	multiChainSelect : function(options){
		if(!options){alert('정의된 속성이 없습니다.\ndataList,rootKey,elemList[] 속성을 정의해주세요');return false;}
		if(!options.dataList){alert('dataList 속성을 정의해주세요');return false;}
		if(!options.rootKey){alert('rootKey 속성을 정의해주세요');return false;}
		if(!options.elemList){alert('elemList 속성을 정의해주세요');return false;}
		if(!options.elemList[0].target){alert('elemList.target 속성을 정의해주세요');return false;}
		var defaultOptionMsg="선택";
		if(options.optionMsg)defaultOptionMsg=options.optionMsg;

		var autoSelect = false;
		if(options.autoSelect) autoSelect=options.autoSelect;

		options.rootKey = '/'+options.rootKey;
		var selectOptions=$.extend({
	    	rootKey : ""
	    	,dataList : new Array()
	      	,elemList : [{
    	      	target : ""
    	     }]
		},options);
		//상위코드 구분 오브젝트 배열생성
	    var codeObj={};
	    $(selectOptions.dataList).each(function(i,v){
	    	if(!codeObj[v.parntsCodePath]){
		      	codeObj[v.parntsCodePath]=v.parntsCodePath;
		      	codeObj[v.parntsCodePath]=new Array();
	    	}
	    	codeObj[v.parntsCodePath].push({text:v.codeNm,value:v.code,'data-code-path':v.codePath});
	    });

	    var targetsObj = [];
	    $(selectOptions.elemList).each(function(i,v){
	    	targetsObj.push(v.target)
	    });

		if(selectOptions.elemList[0].optionMsg)
	    	targetsObj[0].append($('<option>',{text:selectOptions.elemList[0].optionMsg,value:""}))
		else
	    	targetsObj[0].append($('<option>',{text:defaultOptionMsg,value:""}))

	    if(selectOptions.elemList[0].extraOptionMsg){
	    	targetsObj[0].append($('<option>',{'data-ignore-validate':'true', text:selectOptions.elemList[0].extraOptionMsg,value:''}));
	    }
	    $(codeObj[selectOptions.rootKey]).each(function(i,v){
	    	targetsObj[0].append($('<option>',v))
	    });
	    if(selectOptions.elemList[0].value){
	    	targetsObj[0].val(selectOptions.elemList[0].value).prop("selected", true);
	    	if(targetsObj[0].val() == null)targetsObj[0].val(null).prop("selected", true);

	    }
	    $(selectOptions.elemList).each(function(i,v){

	        if(selectOptions.elemList[0].value){
	    		targetsObj[0].val(selectOptions.elemList[0].value).prop("selected", true);
	    		if(targetsObj[0].val() == null)targetsObj[0].val(null).prop("selected", true);

		        if(selectOptions.elemList[i+1]){
		            targetsObj[i+1].empty();

					if(selectOptions.elemList[i+1].optionMsg)
						targetsObj[i+1].append($('<option>',{text:selectOptions.elemList[i+1].optionMsg,value:""}));
					else
						targetsObj[i+1].append($('<option>',{text:defaultOptionMsg,value:""}));

		    	    if(selectOptions.elemList[i+1].extraOptionMsg){
		    	    	targetsObj[i+1].append($('<option>',{'data-ignore-validate':'true', text:selectOptions.elemList[i+1].extraOptionMsg,value:''}));

		    	    }

		            var selectedVal=$(targetsObj[i]).find(":selected").data("codePath");
		            $(codeObj[selectedVal]).each(function(j,code){
						targetsObj[i+1].append($('<option>',code))
						targetsObj[i+1].val(selectOptions.elemList[i+1].value).prop("selected", true);
						if(targetsObj[i+1].val() == null)targetsObj[i+1].val(null).prop("selected", true);

		            });
		        }
	    	}else{
	    		if(i !== 0){

					if(selectOptions.elemList[i].optionMsg)
						targetsObj[i].append($('<option>',{text:selectOptions.elemList[i].optionMsg,value:""}));
					else
						targetsObj[i].append($('<option>',{text:defaultOptionMsg,value:""}));
	    		}
	    	}

	    	targetsObj[i].change(function(e){
	    		if(selectOptions.elemList[i].change){
	    			var selectedVal=$(targetsObj[i]).find(":selected").data("codePath");
	    			selectOptions.elemList[i].change(e,$(codeObj[selectedVal]).length === 0?[]:$(codeObj[selectedVal]));

	    		}

	        	if(selectOptions.elemList[i+1]){
		          	targetsObj[i+1].empty();


					if(selectOptions.elemList[i+1].optionMsg)
						targetsObj[i+1].append($('<option>',{text:selectOptions.elemList[i+1].optionMsg,value:""}));
					else
						targetsObj[i+1].append($('<option>',{text:defaultOptionMsg,value:""}));

		    	    if(selectOptions.elemList[i+1].extraOptionMsg){
		    	    	targetsObj[i+1].append($('<option>',{'data-ignore-validate':'true', text:selectOptions.elemList[i+1].extraOptionMsg,value:''}));

		    	    }

		            if(selectOptions.elemList[i+2]){
			          	targetsObj[i+2].empty();


						if(selectOptions.elemList[i+2].optionMsg)
							targetsObj[i+2].append($('<option>',{text:selectOptions.elemList[i+2].optionMsg,value:""}));
						else
							targetsObj[i+2].append($('<option>',{text:defaultOptionMsg,value:""}));

			    	    if(selectOptions.elemList[i+2].extraOptionMsg){
			    	    	targetsObj[i+2].append($('<option>',{'data-ignore-validate':'true', text:selectOptions.elemList[i+2].extraOptionMsg,value:''}));
			    	    }
		            }
		            if(selectOptions.elemList[i+3]){
			          	targetsObj[i+3].empty();

						if(selectOptions.elemList[i+3].optionMsg)
							targetsObj[i+3].append($('<option>',{text:selectOptions.elemList[i+3].optionMsg,value:""}));
						else
							targetsObj[i+3].append($('<option>',{text:defaultOptionMsg,value:""}));

						if(selectOptions.elemList[i+3].extraOptionMsg){
			    	    	targetsObj[i+3].append($('<option>',{'data-ignore-validate':'true', text:selectOptions.elemList[i+3].extraOptionMsg,value:''}));
			    	    }
		            }
		            if(selectOptions.elemList[i+4]){
			          	targetsObj[i+4].empty();

						if(selectOptions.elemList[i+4].optionMsg)
							targetsObj[i+4].append($('<option>',{text:selectOptions.elemList[i+4].optionMsg,value:""}));
						else
							targetsObj[i+4].append($('<option>',{text:defaultOptionMsg,value:""}));

						if(selectOptions.elemList[i+4].extraOptionMsg){
			    	    	targetsObj[i+4].append($('<option>',{'data-ignore-validate':'true', text:selectOptions.elemList[i+4].extraOptionMsg,value:''}));
			    	    }
		            }

		            var selectedVal=$(targetsObj[i]).find(":selected").data("codePath");
		            $(codeObj[selectedVal]).each(function(j,code){
		              targetsObj[i+1].append($('<option>',code))
		            });

		            if(autoSelect==true){
		            	if($(targetsObj[i+1]).find("option").length == 2){
		            		$(targetsObj[i+1]).find("option:eq(1)").attr("selected", "selected");
		            		$(targetsObj[i+1]).trigger("change");
		            	}
		            }
	        	}

	        	if(selectOptions.elemList[i].callback){
		          	var callbackApply=[]
		            callbackApply.push(this)
		          	selectOptions.elemList[i].callback.apply(callbackApply)
		          	//alert(selectOptions.elemList[i]+"000000");
	        	}
	        });
	    });
	},
	//폼의 입력요소를 오브젝트로 변환한다.
	formToObject : function(formId){
		if(!formId){alert('Form Id 를 정의해주세요');return false;}

		//money 숫자에 , 삭제하는 부분
		$("#" + formId).find('input[type="text"][data-ax5formatter="money"], input[type="text"][data-ax5formatter="money(int)"]').each(function(index, element){
			$(this).val($(this).val().replace(/,/g, ''));
		});

		return form2js(document.getElementById(formId));
	},
	//폼의 입력요소를 JSON으로 변환한다.
	formToJSON : function(formId){
		if(!formId){alert('Form Id 를 정의해주세요');return false;}

		//money 숫자에 , 삭제하는 부분
		$("#" + formId).find('input[type="text"][data-ax5formatter="money"], input[type="text"][data-ax5formatter="money(int)"]').each(function(index, element){
			$(this).val($(this).val().replace(/,/g, ''));
		});

		return JSON.stringify(form2js(document.getElementById(formId)));
	},
	// alert
	alert : function(options, callback) {
		if(!options){alert('정의된 속성이 없습니다.\nmsg속성을 정의해주세요');return false;}
		if(!options.msg){alert('msg 속성을 정의해주세요');return false;}

		var title = '확인';
		var titleColor = '#fff';
		var fontColor = '#212529';

		if(options.theme){
			switch(options.theme){
				case 'info' :
					title = '확인';
					titleColor = '#fff';
					fontColor = '#212529';
					break;
				case 'warning' :
					title = '알림';
					titleColor = '#f0ad4e';
					fontColor = 'white';
					break;
				case 'error' :
					title = '경고';
					titleColor = '#d9534f';
					fontColor = 'white';
					break;
				default :
					title='확인';
					titleColor = '#fff';
					fontColor = '#212529';
			}
		}

		if(options.title){
			title=options.title;
		}

		var selectorLength = $("[name=alertModalCenterName]").length;
		if (!selectorLength)
			selectorLength = 0;

		var modalId = "alertModalCenterId" + (selectorLength + 1);
		var modalContent = modalId + "ContentId";

		var alertElem = [];
		alertElem.push('<div class="modal" id="' + modalId +'" tabindex="-1" name = "alertModalCenterName" role="dialog" aria-labelledby="alertModalCenterTitle" aria-hidden="true">');
		alertElem.push('	<div class="modal-dialog modal-dialog-centered" role="document">');
		alertElem.push('		<div class="modal-content" id="' + modalContent +'">');
		alertElem.push('			<div class="modal-header" style="background-color:' + titleColor + ';">');
		alertElem.push('				<h5 class="modal-title" id="alertModalCenterTitle" style="color: ' + fontColor + ';">' + title + '</h5>');
		alertElem.push('				<button type="button" class="close" data-dismiss="modal" aria-label="Close">');
		alertElem.push('					<span aria-hidden="true">&times;</span>');
		alertElem.push('				</button>');
		alertElem.push('			</div>');
		alertElem.push('			<div class="modal-body">');
		alertElem.push('				<p>' + options.msg + '</p>');
		alertElem.push('			</div>');
		alertElem.push('			<div class="modal-footer">');
		alertElem.push('				<button type="button" class="btn btn-secondary" data-dismiss="modal">확인</button>');
		alertElem.push('			</div>');
		alertElem.push('		</div>');
		alertElem.push('	</div>');
		alertElem.push('</div>');

		$(document.body).append(alertElem.join(""));

		$("#" + modalId).modal({
			keyboard : true
		});
		$("#" + modalContent).addClass("animate__animated animate__fadeInDown animate__faster");

		// 확인 버튼 클릭 후 modal이 제거된 후 호출됨
		$(document).one('shown.bs.modal', '#' + modalId, function(event){

			// 확인 버튼 focus
			$('[data-dismiss="modal"]').focus();

			event.stopImmediatePropagation();
		});

		// 모달을 닫여지는 순간
		var hideDelay = true;
		$(document).one('hide.bs.modal', "#" + modalId, function(event){

			if(hideDelay){
				$("#" + modalContent).removeClass("animate__animated animate__fadeInDown animate__faster").addClass("animate__animated animate__fadeOutUp animate__faster");
				hideDelay = false;
				setTimeout(function(){
					$("#" + modalId).modal('hide');
				},500);
				return false;
			}
			hideDelay = true;

			event.stopImmediatePropagation();
		});

		// 확인 버튼 클릭 후 modal이 제거된 후 호출됨
		$(document).one('hidden.bs.modal', "#" + modalId, function(event){

			$("#" + modalId).off();
			$("#" + modalId).remove();

			if(callback)
				callback();

			if(options.elem){

					options.elem.focus();
					var uAgent = navigator.userAgent;
					if (uAgent.indexOf('Trident') > -1 || uAgent.indexOf('MSIE') > -1) {
			            //IE일 경우 해당 Element로 화면 스크롤
						var location = options.elem.offset().top;
						window.scrollTo({top:location, behavior:'smooth'});
			        }
			}

			event.stopImmediatePropagation();
		});
	},
	//confirm
	confirm : function(options, callback) {
		if(!options){alert('정의된 속성이 없습니다.\nmsg속성을 정의해주세요');return false;}
		if(!options.msg){alert('msg 속성을 정의해주세요');return false;}

		var title = '확인';
		var titleColor = '#fff';
		var fontColor = '#212529';

		if(options.theme){
			switch(options.theme){
				case 'info' :
					title = '확인';
					titleColor = '#fff';
					fontColor = '#212529';
					break;
				case 'warning' :
					title = '알림';
					titleColor = '#f0ad4e';
					fontColor = 'white';
					break;
				case 'error' :
					title = '경고';
					titleColor = '#d9534f';
					fontColor = 'white';
					break;
				default :
					title='확인';
					titleColor = '#fff';
					fontColor = '#212529';
			}
		}

		if(options.title){
			title=options.title;
		}

		var selectorLength = $("[name=confirmModalCenterName]").length;
		if (!selectorLength)
			selectorLength = 0;

		var modalId = "confirmModalCenterId" + (selectorLength + 1);
		var modalContent = modalId + "ContentId";

		var confirmElem = [];
		confirmElem.push('<div class="modal" id="' + modalId +'" name="confirmModalCenterName" tabindex="-1" role="dialog" aria-labelledby="confirmModalCenterTitle" aria-hidden="true" confirm-key-value="">');
		confirmElem.push('	<div class="modal-dialog modal-dialog-centered" role="document">');
		confirmElem.push('		<div class="modal-content" id="' + modalContent +'">');
		confirmElem.push('			<div class="modal-header" style="background-color:' + titleColor + ';">');
		confirmElem.push('				<h5 class="modal-title" id="confirmModalCenterTitle" style="color: ' + fontColor + ';">' + title + '</h5>');
		confirmElem.push('				<button type="button" class="close" data-dismiss="modal" aria-label="Close" confirm-button-type="cancel">');
		confirmElem.push('					<span aria-hidden="true">&times;</span>');
		confirmElem.push('				</button>');
		confirmElem.push('			</div>');
		confirmElem.push('			<div class="modal-body">');
		confirmElem.push('				<p>' + options.msg + '</p>');
		confirmElem.push('			</div>');
		confirmElem.push('			<div class="modal-footer">');
		confirmElem.push('				<button type="button" class="btn btn-primary" data-dismiss="modal" confirm-button-type="ok">예</button>');
		confirmElem.push('				<button type="button" class="btn btn-secondary" data-dismiss="modal" confirm-button-type="cancel">아니오</button>');
		confirmElem.push('			</div>');
		confirmElem.push('		</div>');
		confirmElem.push('	</div>');
		confirmElem.push('</div>');

		$(document.body).append(confirmElem.join(""));

		$("#" + modalId).modal({
			backdrop : "static"
		});
		$("#" + modalContent).addClass("animate__animated animate__fadeInDown animate__faster");

		$(document).one("click", "[confirm-button-type]", function(event){
			var keyVal = this.getAttribute("confirm-button-type");
			$("#" + modalId).attr("confirm-key-value", keyVal);

			event.stopImmediatePropagation();
		});

		// modal이 보여진 후 호출됨
		$(document).one('shown.bs.modal', '#' + modalId, function(event){

			// 확인 버튼 focus
			if (!options.focus && options.focus == "ok")
				$('[confirm-button-type="ok"]').focus();
			else
				$('[confirm-button-type="cancel"]').focus();

			event.stopImmediatePropagation();
		});

		// 모달을 닫여지는 순간
		var hideDelay = true;
		$(document).one('hide.bs.modal', "#" + modalId, function(event){

			if(hideDelay){
				$("#" + modalContent).removeClass("animate__animated animate__fadeInDown animate__faster").addClass("animate__animated animate__fadeOutUp animate__faster");
				hideDelay = false;
				setTimeout(function(){
					$("#" + modalId).modal('hide');
				},500);
				return false;
			}
			hideDelay = true;

			event.stopImmediatePropagation();
		});

		// 확인 버튼 클릭 후 modal이 제거된 후 호출됨
		$(document).one('hidden.bs.modal', "#" + modalId, function(event){

			var keyVal = $("#" + modalId).attr("confirm-key-value");

			$("[confirm-button-type]").off();
			$("#" + modalId).off();
			$("#" + modalId).remove();

			that = {
				self : this,
				key : keyVal
			};

			if(callback)
				callback.call(that, keyVal);

			event.stopImmediatePropagation();
		});
	},
	// modal
	modal : function(options, openCallback, closeCallback, shownCallback) {
		if(!options){alert('정의된 속성이 없습니다.\ntitle속성을 정의해주세요');return false;}
		if(!options.title){alert('title 속성을 정의해주세요');return false;}
		if(!options.modalId){alert('modalId(고유ID) 속성을 정의해주세요');return false;}

		var title = options.title;

		var draggable = false;
		if (options.draggable)
			draggable = options.draggable;

		var scrollable = false;
		if (options.scrollable)
			scrollable = options.scrollable;

		var defaultSize = "modal-df";
		if (options.defaultSize)
			defaultSize = options.defaultSize;

		var modalCenter = options.modalId;
		var modalContent = modalCenter + "ContentId";
		var modalHeader = modalCenter + "HeaderId";
		var modalTitle = modalCenter + "CenterTitle";
		var modalBody = modalCenter + "BodyId";
		var modalFooter = modalCenter + "FooterId";

		var modalElem = [];
		modalElem.push('<div class="modal" id="' + modalCenter +'" tabindex="-1" role="dialog" aria-labelledby="myModalCenterTitle" aria-hidden="true">');
		modalElem.push('	<div class="modal-dialog modal-dialog-centered" role="document">');
		modalElem.push('		<div class="modal-content" id="' + modalContent +'">');

		if (draggable == true) {
			modalElem.push('			<div class="modal-header" id="' + modalHeader + '" style="background-color : #43a49d; cursor : pointer;">');
			modalElem.push('				<h5 class="modal-title" id="' + modalTitle + '" style="color: #ffffff;font-size:18px !important;">' + title + '</h5>');
		}
		else {
			modalElem.push('			<div class="modal-header" id="' + modalHeader + '" style="background-color : white;">');
			modalElem.push('				<h5 class="modal-title" id="' + modalTitle + '" style="color: #003a65;font-size:18px !important;">' + title + '</h5>');
		}

		modalElem.push('				<button type="button" class="close" data-dismiss="modal" aria-label="Close">');
		modalElem.push('					<span aria-hidden="true">&times;</span>');
		modalElem.push('				</button>');
		modalElem.push('			</div>');
		modalElem.push('			<div class="modal-body" id="' + modalBody + '">');

		if (options.html)
			modalElem.push(options.html)

		modalElem.push('			</div>');
		modalElem.push('			<div class="modal-footer" id="' + modalFooter + '">');
		modalElem.push('			</div>');
		modalElem.push('		</div>');
		modalElem.push('	</div>');
		modalElem.push('</div>');

		$(document.body).append(modalElem.join(""));

		// 모달이 보여지는 순간
		$(document).one('show.bs.modal', '#' + modalCenter, function(event){

			if (scrollable == true) {
				$(this).find('.modal-dialog').addClass("modal-dialog-scrollable");
			}

			if (defaultSize != "modal-df") {
				$(this).find('.modal-dialog').addClass(defaultSize);
			}

			if(options.maxWidth !== ""){
				$(this).find('.modal-dialog').attr('style', 'max-width: ' + options.maxWidth + 'px;'); // modal.scss의 max-width를 override
			}

			that = {
				self : this,
				modalCenter : $("#" + modalCenter),
				modalContent : $("#" + modalContent),
				modalHeader : $("#" + modalHeader),
				modalBody : $("#" + modalBody),
				modalFooter : $("#" + modalFooter)
			};

			if(openCallback)
				openCallback.call(that);

			event.stopImmediatePropagation();
		});

		// 모달 show
		$("#" + modalCenter).modal({backdrop : 'static'});
		$("#" + modalContent).addClass("animate__animated animate__fadeInDown animate__faster");

		// 애니메이션 끝나고 난 후 호출
		$("#" + modalContent).on("animationend", function(e) {
			if (e.originalEvent.animationName == "fadeInDown") {
				// 모달 띄우고 난후 - 현재 bootstrap fade 애니메이션 ie 버그 있어서 animate__animated animate__fadeInDown animate__faster 해당 애니 사용함
				// 문제점은 shown.bs.modal 이 불려지지 않거나 불려져도 gridObj가 null 이어서
				// 일단 애니메이션 끝나고 난후 이벤트로 대체
				if(shownCallback)
					shownCallback.call();
			} else if (e.originalEvent.animationName == "fadeOutUp") {
				// 모달 제거 후 - 발생이 됐다 안됐다 함 - 여긴 사용금지
			}
		});

		if (draggable == true) {
	        // Jquery draggable
	        $("#" + modalCenter).draggable({
	            handle: ".modal-header"
	        });
		}

		// 모달이 보여지고 난 후
		// animate__animated animate__fadeInDown animate__faster -> 해당 애니메이션 사용후 문제 있음 - 모르겠음 ㅠ
		$(document).one('shown.bs.modal', '#' + modalCenter, function(event){

			event.stopImmediatePropagation();
		});

		// 모달을 닫여지는 순간
		var hideDelay = true;
		$(document).one('hide.bs.modal', "#" + modalCenter, function(event){

			if(hideDelay){
				$("#" + modalContent).removeClass("animate__animated animate__fadeInDown animate__faster").addClass("animate__animated animate__fadeOutUp animate__faster");
				hideDelay = false;
				setTimeout(function(){
					$("#" + modalCenter).modal('hide');
				},500);
				return false;
			}
			hideDelay = true;

			event.stopImmediatePropagation();
		});

		// 모달이 닫여지고 난 후
		$(document).one('hidden.bs.modal', "#" + modalCenter, function(event){

			$("#" + modalCenter).off();
			$("#" + modalCenter).remove();

			if(closeCallback)
				closeCallback.call();

			event.stopImmediatePropagation();
		});
	},
	// datepicker
	datePicker : function(options) {
		if(!options){alert('정의된 속성이 없습니다.\ntarget속성을 정의해주세요');return false;}
		if(!options.target){alert('target 속성을 정의해주세요');return false;}

		var viewMode = "day";
		var minViewMode = 0;
		var noCalImg = false;

		if(options.viewMode) viewMode = options.viewMode;
		if(options.noCalImg) noCalImg = options.noCalImg;

		if (viewMode == "day")
			minViewMode = 0;
		else if (viewMode == "month")
			minViewMode = 1;
		else if (viewMode == "year")
			minViewMode = 2;

		var dtOptions={};
		var dtOptions=$.extend({
			format : "yyyy-mm-dd",
			language : "ko",
			startDate : "",
			endDate : "",
			autoclose : true,
			clearBtn : false,
			todayBtn : false,
			disableTouchKeyboard : false,
			title : "",
			todayHighlight : true,
			toggleActive : false,
			minViewMode : minViewMode
		},options);

		if( !options.noCalImg )
			// 캘린더 모양 표시용도 추가 (해당 css 존재 필요)
			$(dtOptions.target).addClass('cal-type');

		if (dtOptions.format === "yyyy-mm-dd") {
			$(dtOptions.target).addClass('cal-type-ymd');
		}

		return $(options.target).datepicker(dtOptions);
	},
	//핸들바 컴파일
	handlebarCompile : function(id,obj){
		if(!id){alert('id 속성을 정의해주세요');return false;}
		if(!obj)obj={};
		return $(Handlebars.compile($("#"+id).html())(obj));
	},
	//공통 템플릿
	tableTemplate : function(options){
		var templateOption =  $.extend({
		},options)
		return {
			getOptions : function(){
				return templateOption;
			}
			,setData : function(data){
				var self=this;
				self.eachItem(data,templateOption)
			}
			,eachItem : function(data, option){
				if(option.tableTarget){
					var $html=$(option.tableTarget)
					if(options.addBtn){
					$html.find(option.addBtn).click(function(){
						var rowindex = $html.find('['+option.eachDataKey+'-row-index]:last').attr(option.eachDataKey+"-row-index");
						if(rowindex)
							rowindex=Number(rowindex)+1
						else rowindex= 0;
						var rowcnt = Number(rowindex)+1;

						var $row=$(Handlebars.compile($(option.templateTarget).html())(
								{rowcnt : rowcnt
								,i : rowindex}));
						if(option.crudTarget)
							$row.find(option.crudTarget).val('C');
						$row.attr("data-table-unique-key", commonUtils.getCryptoRandomVal());
						$row.attr(option.eachDataKey+"-row-index",rowindex);
						if(option.addRowBeforeCallback){
							if (option.addRowBeforeCallback($row) == false)
								return false;
						}
						$(option.renderTarget).append($row);
						if(option.addRowAfterCallback){
							option.addRowAfterCallback($row);
						}
						$row.find(option.deleteBtn).click(function(){
							$row.css('display','none')
							var j=1;
							if(option.rownumTarget){
								$($row.parent(option.renderTarget).find(option.rownumTarget)).each(function(i,v){
									if($(v).parent().css('display') !== 'none'){
										$(v).text(j++);
									}
								});
							}
							$row.remove();
							if(option.delRowAfterCallback){
								option.delRowAfterCallback();
							}
						});
						var j=1;
						if(option.rownumTarget){
							$($row.parent(option.renderTarget).find(option.rownumTarget)).each(function(i,v){
								if($(v).parent().css('display') !== 'none'){
									$(v).text(j++);
								}
							});
						}
						if(option.childTemplate){
							childOption=option.childTemplate;
							var $html2=$row.find(childOption.tableTarget);
							$row.find(childOption.addBtn).click(function(){
								var rowindex2 = $row.find('['+childOption.eachDataKey+'-row-index]:last').attr(childOption.eachDataKey+"-row-index");
									if(rowindex2)
										rowindex2=Number(rowindex2)+1
									else rowindex2= 0;
									var rowcnt2 = Number(rowindex2)+1;

									var $row2=$(Handlebars.compile($(childOption.templateTarget).html())(
											{rowcnt : rowcnt2
											,i : rowindex
											,i2 : rowindex2}));
									$row2.find(childOption.crudTarget).val('C');
									$row2.attr(childOption.eachDataKey+"-row-index",rowindex2);
									$row2.attr("data-table-unique-key", commonUtils.getCryptoRandomVal());
									if(childOption.addRowBeforeCallback){
										childOption.addRowBeforeCallback($row2);
									}
									$html2.append($row2);
									if(childOption.addRowAfterCallback){
										childOption.addRowAfterCallback($row2);
									}
									$row2.find(childOption.deleteBtn).click(function(){
										$row2.css('display','none')
										var j2=1;
										if(childOption.rownumTarget){
											$($row2.parent(childOption.renderTarget).find(childOption.rownumTarget)).each(function(i,v){
												if($(v).parent().css('display') !== 'none'){
													$(v).text(j2++);
												}
											});
										}
										$row2.remove();
										if(childOption.delRowAfterCallback){
											childOption.delRowAfterCallback();
										}
									});

								var j2=1;
								if(childOption.rownumTarget){
									$($row2.parent(childOption.renderTarget).find(childOption.rownumTarget)).each(function(i,v){
										if($(v).parent().css('display') !== 'none'){
											$(v).text(j2++);
										}
									});
								}

							});
						}
					})
					}
					//End of addRow
				}

				$(data[option.eachDataKey]).each(function(i,data){
					data.rowcnt=i+1;
					data.i=i

					var $row=$(Handlebars.compile($(option.templateTarget).html())(data));
					if(option.crudTarget)
						$row.find(option.crudTarget).val('U');
					$row.attr(option.eachDataKey+"-row-index",i);
					$row.attr("data-table-unique-key", commonUtils.getCryptoRandomVal());

					if(option.rownumTarget)
						$row.find(option.rownumTarget).text(i+1);
					if(option.deleteBtn){
					$row.find(option.deleteBtn).click(function(){
						if(option.crudTarget)
							$row.find(option.crudTarget).val('D');
						var idx=$row.attr(option.eachDataKey+"-row-index");
						$row.parent(option.renderTarget).find("["+option.eachDataKey+"-row-index="+idx+"]").css("display","none");
						if(option.crudTarget){
							$row.parent(option.renderTarget).find("["+option.eachDataKey+"-row-index="+idx+"]").find(option.crudTarget).css("display","none");
						}
						var j=1;
						if(option.rownumTarget){
							$($row.parent(option.renderTarget).find(option.rownumTarget)).each(function(i,v){
								if($(v).parent().css('display') !== 'none'){
									$(v).text(j++);
								}
							});
						}
						$row.find('input ,select ,textarea ,radio ,checkbox').each(function(i,v){
							$(v).removeAttr('data-validate-type');
						});
						if(option.delRowAfterCallback){
							option.delRowAfterCallback();
						}
					});
					}
					if(option.initCompileBeforeCallback){
						option.initCompileBeforeCallback($row);
					}
					$(option.renderTarget).append($row);
					if(option.initCompileAfterCallback){
						option.initCompileAfterCallback($row);
					}
					if(option.childTemplate){
						childOption=option.childTemplate;
						if(childOption.addBtn){
						$row.find(childOption.addBtn).click(function(){
							var rowindex2 = $row.find('['+childOption.eachDataKey+'-row-index]:last').attr(childOption.eachDataKey+"-row-index");
							if(rowindex2)
								rowindex2=Number(rowindex2)+1
							else rowindex2= 0;
							var rowcnt2 = Number(rowindex2)+1;

							var $row2=$(Handlebars.compile($(childOption.templateTarget).html())(
									{rowcnt : rowcnt2
									,i : i
									,i2 : rowindex2}));
							$row2.find(childOption.crudTarget).val('C');
							$row2.attr(childOption.eachDataKey+"-row-index",rowindex2);
							$row2.attr("data-table-unique-key", commonUtils.getCryptoRandomVal());
							$row.find(childOption.renderTarget).append($row2);
							var j3=1;
							if(childOption.rownumTarget){
								$($row2.parent(childOption.renderTarget).find(childOption.rownumTarget)).each(function(i,v){
									if($(v).parent().css('display') !== 'none'){
										$(v).text(j3++);
									}
								});
							}
							$row2.find(childOption.deleteBtn).click(function(){
								$row2.css('display','none')
								var j2=1;
								if(childOption.rownumTarget){
									$($row2.parent(childOption.renderTarget).find(childOption.rownumTarget)).each(function(i,v){
										if($(v).parent().css('display') !== 'none'){
											$(v).text(j2++);
										}
									});
								}
								$row2.remove();
								if(option.delRowAfterCallback){
									option.delRowAfterCallback();
								}
							});
						});
						}
						//end of child addBtn
						$(data[childOption.eachDataKey]).each(function(i2,data2){
							data2.rowcnt=i2+1;
							data2.i=i;
							data2.i2=i2;

							var $row2=$(Handlebars.compile($(childOption.templateTarget).html())(data2));
							$row2.find(childOption.crudTarget).val('U');
							$row2.attr(childOption.eachDataKey+"-row-index",i2);
							$row2.find(childOption.rownumTarget).text(i2+1);
							if(childOption.deleteBtn){
							$row2.find(childOption.deleteBtn).click(function(){
								$row2.find(childOption.crudTarget).val('D')
								var idx=$row2.attr(childOption.eachDataKey+"-row-index");
								$row2.parent(childOption.renderTarget).find("["+childOption.eachDataKey+"-row-index="+idx+"]").css("display","none")
								var j2=1;
								if(childOption.rownumTarget){
									$($row2.parent(childOption.renderTarget).find(childOption.rownumTarget)).each(function(i,v){
										if($(v).parent().css('display') !== 'none'){
											$(v).text(j2++);
										}
									});
								}
								if(option.delRowAfterCallback){
									option.delRowAfterCallback();
								}
							})
							}
							$row.find(childOption.renderTarget).append($row2);
						})
					}
				});

			}
			,addRow : function($targetDom, data){
				var option=templateOption;
				var rowindex = $html.find('['+option.eachDataKey+'-row-index]:last').attr(option.eachDataKey+"-row-index");
				if(rowindex)
					rowindex=Number(rowindex)+1
				else rowindex= 0;

				var rowcnt = Number(rowindex)+1;
				data.rowcnt=rowindex+1;
				data.rowindex=rowindex;
				data.i=rowindex;

				var $row=$(Handlebars.compile($(option.templateTarget).html())(data));

					if(option.crudTarget)
						$row.find(option.crudTarget).val('C');
					$row.attr(option.eachDataKey+"-row-index",rowindex);
					$row.attr("data-table-unique-key", commonUtils.getCryptoRandomVal());
					if(option.rownumTarget)
						$row.find(option.rownumTarget).text(rowindex+1);
					$row.find(option.deleteBtn).click(function(){
						$row.find(option.crudTarget).val('D');
						var idx=$row.attr(option.eachDataKey+"-row-index");
						$row.parent(option.renderTarget).find("["+option.eachDataKey+"-row-index="+idx+"]").css("display","none");
						if(option.crudTarget){
							$row.parent(option.renderTarget).find("["+option.eachDataKey+"-row-index="+idx+"]").find(option.crudTarget).css("display","none");
						}
						var j=1;
						if(option.rownumTarget){
							$($row.parent(option.renderTarget).find(option.rownumTarget)).each(function(i,v){
								if($(v).parent().css('display') !== 'none'){
									$(v).text(j++);
								}
							});
						}
						if(option.delRowAfterCallback){
							option.delRowAfterCallback();
						}
					});
					if(option.addRowBeforeCallback){
						option.addRowBeforeCallback($row);
					}
					$targetDom.append($row);
					if(option.childTemplate){
						childOption=option.childTemplate;
						$row.find(childOption.addBtn).click(function(){
							var rowindex2 = $row.find('['+childOption.eachDataKey+'-row-index]:last').attr(childOption.eachDataKey+"-row-index");
							if(rowindex2)
								rowindex2=Number(rowindex2)+1
							else rowindex2= 0;
							var rowcnt2 = Number(rowindex2)+1;

							var $row2=$(Handlebars.compile($(childOption.templateTarget).html())(
									{rowcnt : rowcnt2
									,i : rowindex
									,i2 : rowindex2}));
							$row2.find(childOption.crudTarget).val('C');
							$row2.attr(childOption.eachDataKey+"-row-index",rowindex2);
							$row2.attr("data-table-unique-key", commonUtils.getCryptoRandomVal());
							$row.find(childOption.renderTarget).append($row2);
							var j3=1;
							if(childOption.rownumTarget){
								$($row2.parent(childOption.renderTarget).find(childOption.rownumTarget)).each(function(i,v){
									if($(v).parent().css('display') !== 'none'){
										$(v).text(j3++);
									}
								});
							}
							$row2.find(childOption.deleteBtn).click(function(){
								$row2.css('display','none')
								var j2=1;
								if(childOption.rownumTarget){
									$($row2.parent(childOption.renderTarget).find(childOption.rownumTarget)).each(function(i,v){
										if($(v).parent().css('display') !== 'none'){
											$(v).text(j2++);
										}
									});
								}
								$row2.remove();
								if(option.delRowAfterCallback){
									option.delRowAfterCallback();
								}
							});
						});
						$(data[childOption.eachDataKey]).each(function(i2,data2){
							data2.rowcnt=i2+1;
							data2.i=i;
							data2.i2=i2;

							var $row2=$(Handlebars.compile($(childOption.templateTarget).html())(data2));
							$row2.find(childOption.crudTarget).val('C');
							$row2.attr(childOption.eachDataKey+"-row-index",i2);
							$row2.find(childOption.rownumTarget).text(i2+1);
							$row2.find(childOption.deleteBtn).click(function(){
								var idx=$row2.attr(childOption.eachDataKey+"-row-index");
								$row2.parent(childOption.renderTarget).find("["+childOption.eachDataKey+"-row-index="+idx+"]").css("display","none")
								$row2.css('display','none')
								var j2=1;
								if(childOption.rownumTarget){
									$($row2.parent(childOption.renderTarget).find(childOption.rownumTarget)).each(function(i,v){
										if($(v).parent().css('display') !== 'none'){
											$(v).text(j2++);
										}
									});
								}
								$row2.remove();
								if(option.delRowAfterCallback){
									option.delRowAfterCallback();
								}
							})
							$row.find(childOption.renderTarget).append($row2);
						})
					}
			}
			,deleteRow : function($targetDom){
				var option=templateOption;
				$targetDom.find(option.crudTarget).val('D')
				var idx=$targetDom.attr(option.eachDataKey+"-row-index");
				$targetDom.parent(option.renderTarget).find("["+option.eachDataKey+"-row-index="+idx+"]").css("display","none")
				$targetDom.css('display','none')
				var j2=1;
				if(option.rownumTarget){
					$($targetDom.parent(option.renderTarget).find(option.rownumTarget)).each(function(i,v){
						if($(v).parent().css('display') !== 'none'){
							$(v).text(j2++);
						}
					});
				}
				$targetDom.remove();
			}
			,getCheckedList : function(){

			}
		};
	},
	//페이징 처리
	pagination : function(page,$target,onChange,scrolTarget){
		scrolTarget = scrolTarget ? scrolTarget : "#";
		var pageParam=page;
		var onclickPageMove = function onclickPageMove(_act) {
			var callback = function callback(_pageNo) {
				if (pageParam.currentPage != _pageNo) {
					pageParam.selectPage = _pageNo;
					if (onChange) {
						onChange.call({
							page : pageParam
						});
					}
				}
			};

			var processor = {
				"first" : function first() {
					callback.call(this, 0);
				},
				"prev" : function prev() {
					var pageNo = pageParam.currentPage -1;
					if (pageNo < 0)
						pageNo = 0;
					callback.call(this, pageNo);
				},
				"next" : function next() {
					var pageNo = pageParam.currentPage + 1;
					if (pageNo > pageParam.totalPages - 1)
						pageNo = pageParam.totalPages - 1;
					callback.call(this, pageNo);
				},
				"last" : function last() {
					callback.call(this, pageParam.totalPages - 1);
				}
			};

			if (_act in processor) {
				processor[_act].call(this);
			} else {
				callback.call(this, _act - 1);
			}
		};

		var navigationUpdate = function navigationUpdate() {
				var page = {
					hasPage : false,
					currentPage : pageParam.currentPage,
					pageSize : pageParam.pageSize,
					totalElements : pageParam.totalElements,
					totalPages : pageParam.totalPages
				};

				var navigationItemCount = pageParam.pageSize;
				page["@paging"] = function() {
					var returns = [], startI = void 0, endI = void 0;

					startI = page.currentPage - Math.floor(navigationItemCount / 2);
					if (startI < 0)
						startI = 0;
					endI = page.currentPage + navigationItemCount;
					if (endI > page.totalPages)
						endI = page.totalPages;

					if (endI - startI > navigationItemCount) {
						endI = startI + navigationItemCount;
					}

					if (endI - startI < navigationItemCount) {
						startI = endI - navigationItemCount;
					}
					if (startI < 0)
						startI = 0;

					for (var p = startI, l = endI; p < l; p++) {
						returns.push({
							'pageNo' : p + 1,
							'selected' : page.currentPage == p
						});
					}
					return returns;
				}();

				if (page["@paging"].length > 0) {
					page.hasPage = true;
				}

				$target.empty();

				var pagediv=[];
				pagediv.push('<li><a href="'+scrolTarget+'" data-page-move="first"><img src="' + contextPath + '/images/kpcs/first_btn.png" alt="처음페이지"></a></li>');
				pagediv.push('<li><a href="'+scrolTarget+'" data-page-move="prev"><img src="' + contextPath + '/images/kpcs/arrow_l.png" alt="이전페이지"></a></li>');
				if(page.hasPage){
					var currentPage = page.currentPage+1;
					$.each(page["@paging"],function(i,v){
						if(currentPage === v.pageNo){
							pagediv.push('<li><a class="active" href="'+scrolTarget+'">'+v.pageNo+'</a></li>');
						}else{
							pagediv.push('<li><a href="'+scrolTarget+'" data-page-move="'+v.pageNo+'">'+v.pageNo+'</a></li>');
						}
					});
				}else{
					pagediv.push('<li><a class="active" href="'+scrolTarget+'">1</a></li>');
				}
				pagediv.push('<li><a href="'+scrolTarget+'" data-page-move="next"><img src="' + contextPath + '/images/kpcs/arrow_r.png" alt="다음페이지"></a></li>');
				pagediv.push('<li><a href="'+scrolTarget+'" data-page-move="last"><img src="' + contextPath + '/images/kpcs/end_btn.png" alt="마지막페이지"></a></li>');
				$target.append(pagediv.join(""));

				$target.find("[data-page-move]").on(
						"click",
						function() {
							onclickPageMove.call(null, this.getAttribute("data-page-move"));
						});
		};
		navigationUpdate();
	},
	//페이지 서브밋 처리
	pageSubmit : function(options){
		if(!options){alert('정의된 속성이 없습니다.\n옵션 속성을 정의해주세요');return false;}
		if(!options.url){alert('정의된 속성이 없습니다.\nurl 속성을 정의해주세요');return false;}
		if(!options.type)options.type='post';
		if(!options.target)options.target='_self';
		var params=[];

		if(options.form)params = options.form.serializeArray();
	    var form = $('<form />', {
	        action: options.url,
	        method: options.type,
	        target: options.target,
	        style: 'display: none;'
	    });

		$.each(params,function(i,v){
			$('<input />',{
			    type: 'hidden',
			    name: v.name,
			    value : v.value
			}).appendTo(form);
		});

		if(options.data){
			$.each(options.data,function(i,v){
				$('<input />',{
				    type: 'hidden',
				    name: v.name,
				    value : v.value
				}).appendTo(form);
			});
		}
		$.busyLoadFull("show", {
			fontawesome: "fa fa-cog fa-spin fa-3x fa-fw" });
		form.appendTo('body').submit().remove();
		return $.busyLoadFull("hide");
	}
	//탭버튼 클릭시 활성화처리
	,openTab : function(evt, tabName, callback){
	    var i, tabcontent, tablinks;
	    tabcontent = document.getElementsByClassName("tabcontent");
	    for (i = 0; i < tabcontent.length; i++) {
	        tabcontent[i].style.display = "none";
	    }
	    tablinks = document.getElementsByClassName("tablinks");
	    for (i = 0; i < tablinks.length; i++) {
	        tablinks[i].className = tablinks[i].className.replace(" active", "");
	    }
	    document.getElementById(tabName).style.display = "block";
	    evt.currentTarget.className += " active";
	    if(callback){
	    	callback();
	    }
	},
	//주소검색
	findAddr : function(callback){

		if(!callback)
			alert('콜백함수를 지정해주세요');
		else
			commonUtils.popupOpen({
				url:contextPath+'/popup/jusoSearch.do?callBack='+callback,
				popupId:'addrPop',
				width:570,
				height:457
			});
	},
	//날짜비교
	compareDate : function(sDate, eDate){
//	 	사용법
//	 	$('[data-ax5picker="calendar"]').change(function(){
//	 		commonUtils.compareDate($('[name="startDate"]'),$('[name="endDate"]'));
//	    });
	    var startDeArr=$(sDate).val().split('-');
	    var endDeArr = $(eDate).val().split('-');

	    var startDateCompare = new Date(startDeArr[0], parseInt(startDeArr[1])-1, startDeArr[2]);
	    var endDateCompare = new Date(endDeArr[0], parseInt(endDeArr[1])-1, endDeArr[2]);

	    if(startDateCompare > endDateCompare){
	    	commonUtils.alert({
				title : '날짜를 확인하여 주십시오.',
				msg : '종료 날짜가 시작날짜보다 빠릅니다.',
				theme : 'info'
			},
			function(){
				$(eDate).val($(sDate).val());
				$(eDate).focus();
			})
	    }
	},
	//팝업을 호출한다.
	popupOpen:function(options){
		if(!options.popupId){alert('popupId 를 정의해주세요');return false;}
		var width=900;
		var height=700;
		var scrollbars = "no";
		if(options.width) width=options.width;
		if(options.height) height=options.height;
		if(options.scrollbars) scrollbars=options.scrollbars;
		if(!options.type)options.type='post'

        var left = window.screenX + (screen.width / 2) - (width / 2);
        var top = (screen.height / 2) - (height / 2);

		var params=[];
		if(options.form)params = options.form.serializeArray();
	    var form = $('<form />', {
	        action: options.url,
	        method: options.type,
	        style: 'display: none;',
	        target : options.popupId
	    });

		$.each(params,function(i,v){
			$('<input />',{
			    type: 'hidden',
			    name: v.name,
			    value : v.value
			}).appendTo(form);
		});

		if(options.data){
			$.each(options.data,function(i,v){
				$('<input />',{
				    type: 'hidden',
				    name: v.name,
				    value : v.value
				}).appendTo(form);
			});
		}
		if(options.callback){
			$('<input />',{
			    type: 'hidden',
			    name: 'callback',
			    value : options.callback
			}).appendTo(form);
		}

		//IE11을 관리자모드로 실행할경우 post 전송시 팝업이 새창이 아닌 탭에서 뜨는 문제가 있으므로 스토리지 방식이용
		if(ax5.info.browser && ax5.info.browser.name === 'mozilla' && ax5.info.browser.version === '11.0'){
			var fData={};
			fData['action'] = options.url;
			fData['method'] = options.type;
			fData['params']=form.serializeArray();
			window.sessionStorage.setItem('popup_params',JSON.stringify(fData));
			var pop = window.open(contextPath+'/html/popup_caller.html', options.popupId,"width="+width+", height="+height+", top="+top+", left="+left+", screenX="+left+",scrollbars="+scrollbars+",resizable=yes,toolbar=no,menubar=no,directories=no,status=no");
			if(pop){
				if(options.title){
					pop.document.title=options.title;
				}
				pop.focus();
			}
			else
				alert('팝업이 차단되었습니다. 차단된 팝업을 허용해 주세요.');
		}else{
			var pop = window.open('', options.popupId,"width="+width+", height="+height+", top="+top+", left="+left+", screenX="+left+",scrollbars="+scrollbars+",resizable=yes,toolbar=no,menubar=no,directories=no,status=no");
			form.appendTo('body').submit().remove();
			if(pop){
				if(options.title){
					pop.document.title=options.title;
				}
				pop.focus();
			}
			else
				alert('팝업이 차단되었습니다. 차단된 팝업을 허용해 주세요.');
		}

	},
	//Toast 옵션
	toast : function(options,callback){
		if(!options){alert('정의된 속성이 없습니다.\nmsg속성을 정의해주세요');return false;}
		if(!options.msg){alert('msg 속성을 정의해주세요');return false;}
		var toast = new ax5.ui.toast({
        	theme: "info"
            ,containerPosition: "bottom-right"
            ,icon: '<i class="fa fa-bell"></i>'
    		});
		var toastOptions={};
		var toastOptions=$.extend({
		},options);
		toast.push(toastOptions,callback);
	},
	//전달받은 인자에서 func 키에 들어있는 함수를 실행하고 인자를 넘긴다.
	receiveMessage : function(sendMessage){
	    if(sendMessage.func){
	    	if (typeof(window[sendMessage.func]) == "function") {
	    		window[sendMessage.func].call(null, sendMessage);
	    	}
	    }
	},
	/**
	 * 상세검색 보이기/숨기기 사용
	 */
	addExpandSearchBox : function(){

		$(document).on("click",".searchBox .search_p_box",function(){
			if($(".sc_search_plus").css("display")=="none"){
				$(".sc_search_plus").show(300);
				$(this).children(".search_p_dtl_btn").css({"background":"url('"+contextPath+"/images/kpcs/detail_arrowup_icon.png') 50% 50%"});
			}else{
				$(".sc_search_plus").hide(300);
				$(this).children(".search_p_dtl_btn").css({"background":"url('"+contextPath+"/images/kpcs/detail_arrowdown_icon.png') 50% 50%"});
			}
		});
	},
	/**
	 * 탭 관련
	 */
	addTabCtrl : function(options, tabButtonCallback, tabSelectCallback){
		if(!options){alert('정의된 속성이 없습니다.\ntarget, columns 속성을 정의해주세요123');return false;}
		if(!options.sliderTarget){alert('sliderTarget 속성을 정의해주세요');return false;}
		if(!options.selectTarget){alert('selectTarget 속성을 정의해주세요');return false;}
		if(!options.contentClass){alert('contentClass 속성을 정의해주세요');return false;}

		var $tabButton = options.sliderTarget;
		var $tabSelect = options.selectTarget;
		var $tabContents = options.contentClass;
		var $tabButtonItems = $tabButton.children('li');
		var activeClass = 'active';
		var slideWidth = 190;
		if(options.slideWidth) slideWidth=options.slideWidth;

		// PC 슬라이더 생성
		/*
		var slider = $(options.sliderTarget).bxSlider({
			auto: false
			,controls:true
			,pager:false
			,maxSlides: 10
			,moveSlides:1
			,slideWidth: slideWidth
			,slideMargin:10
			,autoHover:true
			,infiniteLoop:false
			,hideControlOnEnd:true
		});
		*/
		// 초기화
		$tabButtonItems.first().addClass(activeClass);
		$tabContents.not(':first').hide() // not(선택자) - 선택한 요수중에서 지정한 선택자와 일치하지 않은 요소를 모두 선택함

		// button 이벤트
		$tabButtonItems.find('a').on('click', function(e){
			var tabId = $(this).attr('href');

			$tabButtonItems.removeClass(activeClass);

			var liId = $(this).parent().attr('id');
			$.each($tabButtonItems.filter(function () { return this.id == liId; }), function(i,v){
				$(v).addClass(activeClass);
			});

			$tabSelect.val(tabId);
			$tabContents.hide();
			$(tabId).show();  // 위치상관없이 해당아이디값 show

			if (tabButtonCallback)
				tabButtonCallback($(this).parent());

			e.preventDefault();
		});

		// selet 이벤트
		$tabSelect.on('change', function(){
			var target = $(this).val(),
				targetSelectNum = $(this).prop('selectedIndex');

			$tabButtonItems.removeClass(activeClass);
			$tabButtonItems.eq(targetSelectNum).addClass(activeClass);
			$tabContents.hide();
			$(target).show();

			if (tabSelectCallback)
				tabSelectCallback(this);
		});

		//return slider;
	}
	// 화면 상단을 원하는 위치(obj의 상단)로 이동
	, moveScrollTop : function(target, duration) {
		if(!duration){duration = 400;}
		if(!target){alert('target 속성을 정의해주세요');return false;}
		$('html, body').animate({
			scrollTop : $(target).offset().top
				// 상단 메뉴 높이 확인
				- ($('.top_menu').height() === 0 ? 0 : $('.top_header').outerHeight())
			}, duration);
	}
	, isMobileOrNot : function (){
		var UserAgent = navigator.userAgent;

		if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null|| UserAgent.match(/LG|SAMSUNG|Samsung/) != null){
			return true;
		} else {
			return false;
		}
	}
	, chkPw : function (data){ //비밀번호 규칙 체크

		var resultVal = false;
		var pw = data.regPw;
		var id = data.userId;

		var reg = /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/])(?!.*012|123|234|345|456|789|890).{9,16}$/;

		if(false === reg.test(pw)) {
			commonUtils.alert({
				title : '확인'
				,theme : 'warning'
				,msg : '비밀번호는 9~16자 영문자, 숫자, 특수문자 조합을 사용해주세요'
			});
			resultVal = true;
		}else if(/(\w)\1\1\1/.test(pw)){
			commonUtils.alert({
				title : '확인'
				,theme : 'warning'
				,msg : '비밀번호에 4자 이상의 반복 문자(aaaa) 및 숫자(1111)를 사용하실 수 없습니다.'
			});
			resultVal = true;
		}else if(pw.search(id) > -1){
			commonUtils.alert({
				title : '확인'
				,theme : 'warning'
				,msg : '비밀번호에 아이디가 포함되어있습니다.'
			});
			resultVal = true;
		}else if(pw.search(/\s/) != -1){
			commonUtils.alert({
				title : '확인'
				,theme : 'warning'
				,msg : '비밀번호는 공백 없이 입력해주세요.'
			});
			resultVal = true;
		}else{

			var intCnt1 = 0;
	        var intCnt2 = 0;
	        var temp0 = "";
	        var temp1 = "";
	        var temp2 = "";
	        var temp3 = "";

	        for (var i = 0; i < pw.length-3; i++) {
	            temp0 = pw.charAt(i);
	            temp1 = pw.charAt(i + 1);
	            temp2 = pw.charAt(i + 2);
	            temp3 = pw.charAt(i + 3);

	            if (temp0.charCodeAt(0) - temp1.charCodeAt(0) == 1
	                    && temp1.charCodeAt(0) - temp2.charCodeAt(0) == 1
	                    && temp2.charCodeAt(0) - temp3.charCodeAt(0) == 1) {
	                intCnt1 = intCnt1 + 1;
	            }

	            if (temp0.charCodeAt(0) - temp1.charCodeAt(0) == -1
	                    && temp1.charCodeAt(0) - temp2.charCodeAt(0) == -1
	                    && temp2.charCodeAt(0) - temp3.charCodeAt(0) == -1) {
	                intCnt2 = intCnt2 + 1;
	            }
	        }

			if(intCnt1 > 0 || intCnt2 > 0 )  {
				 commonUtils.alert({
						title : '확인'
						,theme : 'warning'
						,msg : '비밀번호에 4자 이상의 연속 문자(abcd) 및 숫자(1234)를 사용하실 수 없습니다.'
					});
				 resultVal = true;
			}
		}

		return resultVal;
	},
	onTab : function(option){

		if(!option.formId){alert('Form Id 를 정의해주세요');return false;}

		var params = $("#"+option.formId).serializeArray();
        commonUtils.pageSubmit({
            url: option.url
            ,
            data: params
        });

	},
	maxLengthCheck : function(obj, len){

		var data = $(obj).val();
		var maxLength = 10000;

		if(len) {
	         maxLength = len;
	    }

	    if(Number(commonUtils.byteCheck(obj)) > Number(maxLength)) {

	    	var msg = $(obj).attr('title') + "이(가) 입력가능한 문자수 ["+ maxLength +"byte] 를 초과하였습니다.";
	    	commonUtils.alert({
				title : '확인'
				,theme : 'warning'
				,msg : msg
			});

	        obj.focus();
	        return false;
	    } else {
	        return true;
	    }

	},
	// 바이트수 반환
	byteCheck : function(obj){
	    var codeByte = 0;
	    var data = $(obj).val();

	    for (var idx = 0; idx < data.length; idx++) {
	        var oneChar = escape(data.charAt(idx));
	        if ( oneChar.length == 1 ) {
	            codeByte ++;
	        } else if (oneChar.indexOf("%u") != -1) {
	            codeByte += 2;
	        } else if (oneChar.indexOf("%") != -1) {
	            codeByte ++;
	        }
	    }
	    return codeByte;
	},
	// 암호화된 Random 값 반환
	getCryptoRandomVal : function(){
		return Math.random().toString(36).slice(2);
	},
	//파일다운로드 처리
	fileDownload : function(options){
		if(!options){alert('정의된 속성이 없습니다.\n옵션 속성을 정의해주세요');return false;}
		if(!options.url){alert('정의된 속성이 없습니다.\nurl 속성을 정의해주세요');return false;}
		if(!options.type)options.type='post';
		var params=[];

		if(options.form)params = options.form.serializeArray();
	    var form = $('<form />', {
	        action: options.url,
	        method: options.type,
	        style: 'display: none;'
	    });

		$.each(params,function(i,v){
			$('<input />',{
			    type: 'hidden',
			    name: v.name,
			    value : v.value
			}).appendTo(form);
		});

		if(options.data){
			$.each(options.data,function(i,v){
				$('<input />',{
				    type: 'hidden',
				    name: v.name,
				    value : v.value
				}).appendTo(form);
			});
		}

		form.appendTo('body');

		$.blockUI({ message: '<h2 style="font-size:15px;"><img src="/images/kpcs/busy.gif" /><strong>파일을 생성중입니다...잠시만 기다려주세요.</strong></h2>' });

		$.fileDownload(form.prop('action'),{
			httpMethod: "POST",
			data : options.data,
		    successCallback: function (url) {
		        $.unblockUI();
		    },
		    failCallback: function (responseHtml, url, error) {
		    	$.unblockUI();
		    }
		});

		form.remove();
	},
}

$(document.body).ready(function(){
	//String startWidth 프로토타입 확장 (IE 지원용)
	if (!String.prototype.startsWith) {
	  String.prototype.startsWith = function(searchString, position) {
	    position = position || 0;
	    return this.indexOf(searchString, position) === position;
	  };
	}
	//자바스크립트 에러발생시 처리
	window.onerror = function allErrorHandler(errorMsg, url, lineNumber) {
		alert("자바스크립트 에러가 발생하였습니다.\n문제 발생시 관리자에게 문의 주시기 바랍니다.\n에러내용 : " + errorMsg);
	    return false;
	}
	//마우스 우클릭 방지
	$(document).bind("contextmenu", function(e) {
		return false;
	});

});
