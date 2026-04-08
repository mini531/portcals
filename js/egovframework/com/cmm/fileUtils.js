
var fileUtils = {
	// 파일 업로드
	fileUpload : function(options){
		if(!options){
			alert('정의된 속성이 없습니다.\ntarget속성을 정의해주세요');
			return false;
		}
		if(!options.target){
			alert('target 속성을 정의해주세요');
			return false;
		}

		var titleMsg="파일첨부";
		if(options.titleMsg)titleMsg=options.titleMsg;
		var simpleMode = false;
		var smsMode = false;
		if(options.simpleMode)simpleMode=options.simpleMode;
		if(options.smsMode)smsMode=options.smsMode;
		var ax5uploaderId=commonUtils.getCryptoRandomVal();
		var maximunFileSize="10MB"; //개별 파일사이즈 제한
		var maximunFileSizeStr="10MB"; //개별 파일사이즈 제한
		var maximunAllFileSize="20MB"; //전체 파일사이즈 제한
		var maximunAllFileSizeStr="20MB"; //전체 파일사이즈 제한
		var maximumNumberOfFiles="10"; //최대 파일첨부 개수
		var deleteBtn=true; //삭제버튼 표시여부
		var insertBtn=true; //파일추가버튼 표시여부
		var imgPreview=true; //이미지 미리보기 표시여부
		var imgOnly=false; //이미지 확장자만 허용가능여부

		var sessionId = "";
		if(options.sessionId) sessionId = options.sessionId;

		/*추가개발내용*/
		var accept=".jpg, .png, .jpeg, .gif, .bmp, .hwp, .hwpx, .hml, .txt, .doc, .xls, .ppt, .xlsx, .docx, .pptx, .pdf, .zip";//허용확장자
		var insertPath = "/cmm/fms/insertTempFileInfs.do";

		if(options.maximunFileSize){
			maximunFileSize=options.maximunFileSize;
			maximunFileSizeStr=options.maximunFileSize;
		}
		if(options.maximunAllFileSize){
			maximunAllFileSize=options.maximunAllFileSize;
			maximunAllFileSizeStr=options.maximunAllFileSize;
		}
		if(options.maximumNumberOfFiles)maximumNumberOfFiles=options.maximumNumberOfFiles;
		if(options.deleteBtn === false)deleteBtn=options.deleteBtn;
		if(options.insertBtn === false)insertBtn=options.insertBtn;


		if(options.imgPreview === false)imgPreview=options.imgPreview;
		if(options.imgOnly)accept=".bmp, .rle, .dib, .jpg, .gif, .png, .tif, .tiff, .raw, jpeg, .BMP, .RLE, .DIB, .JPG, .GIF, .PNG, .TIF, .TIFF, .RAW";
		if(options.accept)accept=options.accept;
		if(options.insertPath) insertPath = options.insertPath;

		var maxSize=maximunFileSize.replace(/[^0-9.]/g,'');
		var maxSizeStr=maximunFileSize.replace(/[0-9.]/g,'');
		var maxAllSize=maximunAllFileSize.replace(/[^0-9.]/g,'');
		var maxAllSizeStr=maximunAllFileSize.replace(/[0-9.]/g,'');
		switch(maxSizeStr){
			case "K" :
				maximunFileSize = Number(maxSize) * 1024;
				maximunAllFileSize = Number(maxAllSize) * 1024;
				break;
			case "KB" :
				maximunFileSize = Number(maxSize) * 1024;
				maximunAllFileSize = Number(maxAllSize) * 1024;
				break;
			case "M" :
				maximunFileSize = Number(maxSize) * 1024 * 1024;
				maximunAllFileSize = Number(maxAllSize) * 1024 * 1024;
				break;
			case "MB" :
				maximunFileSize = Number(maxSize) * 1024 * 1024;
				maximunAllFileSize = Number(maxAllSize) * 1024 * 1024;
				break;
			case "G" :
				maximunFileSize = Number(maxSize) * 1024 * 1024 * 1024;
				maximunAllFileSize = Number(maxAllSize) * 1024 * 1024 * 1024;
				break;
			case "GB" :
				maximunFileSize = Number(maxSize) * 1024 * 1024 * 1024
				maximunAllFileSize = Number(maxAllSize) * 1024 * 1024 * 1024;
				break;
		}

        var toast = new ax5.ui.toast({
            containerPosition: "top-right",
            icon : '<i class="fas fa-file-upload"></i>',
            width : 400
        });

        //이미지 확장자
        var imgFileExtsn=['bmp','rle','dib','jpg','gif','png','tif','tiff','raw','BMP','RLE','DIB','JPG','GIF','PNG','TIF','TIFF','RAW']

		var ax5uploaderElem=[];
        if(!simpleMode){
        	if(!smsMode){
	        	ax5uploaderElem.push('	<div class="signup_mc2">');
	        		ax5uploaderElem.push('		<div class="guide_m_tit">'+titleMsg+'</div>');
        	}
        }else{
        	ax5uploaderElem.push('	<div>');
        }
		ax5uploaderElem.push('		<div data-ax5uploader="'+ax5uploaderId+'">');
		ax5uploaderElem.push('			<input type="hidden" name="maximunFileSize" value="'+maximunFileSize+'"/>');
		ax5uploaderElem.push('			<input type="hidden" name="maximunFileSizeStr" value="'+maximunFileSizeStr+'"/>');
		ax5uploaderElem.push('			<input type="hidden" name="maximunAllFileSize" value="'+maximunAllFileSize+'"/>');
		ax5uploaderElem.push('			<input type="hidden" name="maximunAllFileSizeStr" value="'+maximunAllFileSizeStr+'"/>');
		ax5uploaderElem.push('			<input type="hidden" name="maximumNumberOfFiles" value="'+maximumNumberOfFiles+'"/>');
		ax5uploaderElem.push('			<input type="hidden" name="currentAllFilesSize" value="0"/>');
		ax5uploaderElem.push('			<input type="hidden" name="accept" value="'+accept+'"/>');
		ax5uploaderElem.push('		</div>');
		ax5uploaderElem.push('	<div class="file_btn_box">');
		if(insertBtn === true){
			if(smsMode)
				ax5uploaderElem.push('		<button type="button" data-ax5uploader-button="selector" class="file_add_btn" style="height: 22px;">+</button>');
			else
				ax5uploaderElem.push('		<button type="button" data-ax5uploader-button="selector" class="file_add_btn">파일추가</button>');
		}else{
			ax5uploaderElem.push('		<button type="button" style="display:none;" data-ax5uploader-button="selector" class="file_add_btn">파일추가</button>');
		}
		if(deleteBtn === true){
			if(smsMode)
				ax5uploaderElem.push('		<button type="button" data-upload-btn="removeFile" class="file_del_btn" style="height: 22px;">-</button>');
			else
				ax5uploaderElem.push('		<button type="button" data-upload-btn="removeFile" class="file_del_btn">파일삭제</button>');
		}
		if(options.extraBtn){
			ax5uploaderElem.push(options.extraBtn);
		}
		ax5uploaderElem.push('	</div>');
		ax5uploaderElem.push('</div>');
		$(options.target).append(ax5uploaderElem.join(""));

		$(options.target).find('[data-ax5uploader-button="selector"]').click(function(e){
			if(ax5uploader["__uploading"]){
    			commonUtils.alert({
    				theme : "warning"
    				,title:"파일이 업로드중입니다."
            		,msg:"업로드가 끝나고 추가 할 수 있습니다."
            	});
				e.stopImmediatePropagation();
				return false;
			}
		});

		//첨부파일 제한 정보 모달
		$(options.target).find('[data-ax5uploader-button="selector"]').popover({
			html : true,
			trigger : "hover",
			placement : "top",
			content : '전체 파일 업로드 용량 : <strong>' + maximunAllFileSizeStr + '</strong>' + '<br>개별 파일 업로드 용량 : <strong>' + maximunFileSizeStr + '</strong>' + '<br>최대 첨부파일수 : <strong>' + maximumNumberOfFiles + '개</strong>'
		});

		var emptyTrColspan=5;
		if(deleteBtn === true)emptyTrColspan+=2;
		if(imgPreview === true)emptyTrColspan+=1;

		var emptyTr='<tr id="emptyTr"><td colspan="'+emptyTrColspan+'" style="text-align: center;font-size: 15px;font-weight: bold;">'
			+(options.gridEmptyMsg?options.gridEmptyMsg:'첨부파일이 존재하지 않습니다.')+'</td></tr>';

		var tableTmplStr=[];

		if(insertBtn === true){
			if(!smsMode){
				tableTmplStr.push('<div class="cmt_txt">');
				tableTmplStr.push('* 첨부 가능한 파일 확장자 : <span class="txt_red">');
				tableTmplStr.push(accept); //첨부가능한 파일 확장자
				tableTmplStr.push('</span></div>');
				tableTmplStr.push('<div class="cmt_txt">');
				tableTmplStr.push('* 전체 파일 업로드 용량 : <strong>' + maximunAllFileSizeStr + '</strong>,' + ' 개별 파일 업로드 용량 : <strong>' + maximunFileSizeStr + '</strong>,' + ' 최대 첨부파일수 : <strong>' + maximumNumberOfFiles + '개</strong>');
				tableTmplStr.push('</div>');
			}
		}

		tableTmplStr.push('<table class="file_table" style="display:inline-table;">');

		if(imgPreview === true)
			tableTmplStr.push(' <caption class="hidden">파일 업로드, 파일명, 미리보기, 파일크기, 등록일시, 다운로드 항목으로 구성</caption>')
		else
			tableTmplStr.push(' <caption class="hidden">파일 업로드, 파일명, 파일크기, 등록일시, 다운로드 항목으로 구성</caption>')
		tableTmplStr.push('	<colgroup>');
		if(deleteBtn === true){
			tableTmplStr.push('		<col style="width: 5%;">');
			tableTmplStr.push('		<col style="width: 5%;">');
		}
		tableTmplStr.push('		<col style="width: 45%;">');
		if(imgPreview === true)
			tableTmplStr.push('		<col style="width: 10%;">');
		tableTmplStr.push('		<col style="width: 5%;" class="dis_web_tablecell">');
		tableTmplStr.push('		<col style="width: 10%;" class="dis_web_tablecell">');
		tableTmplStr.push('		<col style="width: 10%;">');
		tableTmplStr.push('	</colgroup>');
		if(!simpleMode){
			tableTmplStr.push('	<thead>');
			tableTmplStr.push('		<tr>');
			if(deleteBtn === true){
				tableTmplStr.push('			<th scope="col">선택</th>');
				tableTmplStr.push('			<th scope="col">상태</th>');
			}
			tableTmplStr.push('			<th scope="col">파일명</th>');
			if(imgPreview === true)
				tableTmplStr.push('			<th scope="col">미리보기</th>');
			tableTmplStr.push('			<th scope="col" class="dis_web_tablecell">파일크기</th>');
			tableTmplStr.push('			<th scope="col" class="dis_web_tablecell">등록일시</th>');
			tableTmplStr.push('			<th scope="col">다운로드</th>');
			tableTmplStr.push('		</tr>');
			tableTmplStr.push('	</thead>');
		}else{
			tableTmplStr.push('	<thead style="display:none">');
			tableTmplStr.push('		<tr><th scope="row"></th></tr>');
			tableTmplStr.push('	</thead>');
		}
		tableTmplStr.push('	<tbody id="imgTableBody">');
		tableTmplStr.push('	</tbody>');
		tableTmplStr.push('</table>');
		tableTmplStr.push('</div>');


		options.gridTarget.append(tableTmplStr.join(""));

		var $uploadTable = options.gridTarget.find('table');

		var $uploadTarget = $(options.target).find('[data-ax5uploader="'+ax5uploaderId+'"]');

		var uploadOptions={};
		var uploadOptions=$.extend({
            debug: false,
    		maximunFileSize:maximunFileSize,
    		maximunAllFileSize:maximunAllFileSize,
            target: $uploadTarget,
            form: {
                action: contextPath + insertPath,
                fileName: "file"
            },
            accept:accept,
            progressBox: true,
            progressBoxDirection: "left",
            multiple: false,
            //manualUpload: true,
            validateSelectedFiles: function () {
				if(this.selectedFiles.length){
					var size=0;
					if(this.selectedFiles[0].size)
						size = this.selectedFiles[0].size;
					else if(this.selectedFiles[0][0].size)
						size = this.selectedFiles[0][0].size;
					if(size > maximunFileSize){
						commonUtils.alert({
		    				theme : "warning"
		    				,title: "입력값을 확인해주세요."
		            		,msg:maximunFileSizeStr+" 보다 큰 파일은 업로드를 할 수가 없습니다."
		            	});
						return false;
					}
				}

            	var fileSum=0;
            	var fileCnt=0;
				$uploadTable.find('tbody tr').each(function(i,v){
					if($(v).attr("id") !== 'emptyTr' && $(v).find('input[name="crudType"]').val() !== "D"){
						fileCnt++;
						fileSum+=Number($(v).find('input[name="fileSize"]').val());
					}
				});
                // 지정된 파일제한개수 이상 업로드 되지 않도록 제한.
                if((fileCnt + this.uploadedFiles.length + this.selectedFiles.length) > Number(maximumNumberOfFiles)){
    				commonUtils.alert({
    					msg : '첨부파일 개수는 최대 '+maximumNumberOfFiles+'개 까지 가능합니다.'
    					,theme : 'warning'
    				});
                	return false;
                }
                $uploadTarget.find('input[name="currentAllFilesSize"]').val(fileSum.toFixed(0));
                return true;
            },
            onprogress: function () {
             	var progress = Math.floor(this.loaded / this.total * 100);
            	ax5uploader.$progressBox.find(".progress").css('width',progress+'%');
            	ax5uploader.$progressBox.find(".progress-bar-striped").css('width','0');
            	ax5uploader.$progressBox.find("[data-percent-txt]").html(progress+'% 진행중...');
            	if(progress === 100){
            		ax5uploader.$progressBox.find("[data-percent-txt]").html(progress+'% 완료! 서버에서 파일을 처리하는 중입니다. 잠시만 기다려주세요');
                    toast.confirm('서버에 파일을 올리는 중입니다.<br>잠시만 기다려주세요.');
            	}
            },
            onuploaded: function () {
            },
            onuploaderror: function () {
            	switch(this.self.status){
            		case 401 :
            			commonUtils.alert({
            				theme : "error"
    	            		,msg:"로그인이 필요한 서비스입니다."
    	            	});
            			break;
            		case 403 :
            			commonUtils.alert({
            				theme : "error"
    	            		,msg:"권한이 없습니다."
    	            	});
            			break;
            		case 400 :
            			commonUtils.alert({
            				theme : "error"
    	            		,msg:this.self.responseText
    	            	});
            			break;
            		default :
            			commonUtils.alert({
            				theme : "error"
    	            		,msg:"파일업로드 처리중 에러가 발생하였습니다."
    	            	});
            	}
            },
            onuploadComplete: function () {
            	if(toast.queue.length > 0)
            		toast.close();

            	switch(this.self.xhr.status){
	        		case 400 :
						commonUtils.alert({
							theme : "error"
							,msg:this.self.xhr.responseText
						});
						ax5uploader.removeFileAll();
						break;
            		case 401 :
            			commonUtils.alert({
            				theme : "error"
    	            		,msg:"로그인이 필요한 서비스입니다."
    	            	});
	        			ax5uploader.removeFileAll();
	        			break;
	        		case 400 :
            			commonUtils.alert({
            				theme : "error"
    	            		,msg:"권한이 없습니다."
    	            	});
	        			ax5uploader.removeFileAll();
	        			break;
            	}
            	ACTIONS["UPDATE_uploaded"](this.self.uploadedFiles);
            	if(this.self.xhr.status.toString().charAt(0) === "2"){
            		if(toast){
            			toast.push('임시 파일업로드가 완료 되었습니다.');
            		}else{
                        var toast2 = new ax5.ui.toast({
                            containerPosition: "top-right",
                            icon : '<i class="fas fa-file-upload"></i>',
                            width : 400
                        });
                        toast2.push('임시 파일업로드가 완료 되었습니다.');
            		}
            		if(options.onuploadCompleteCallback){
            			options.onuploadCompleteCallback(this);
            		}
            	}
            }
        },options);

		var ax5uploader=new ax5.ui.uploader(uploadOptions);
		ax5uploader['getGrid'] = {
			list : function(){
				var objarr=[];
				$uploadTable.find('tbody tr').each(function(i,v){
					if($(v).attr("id") !== 'emptyTr'){
						objarr.push({
							crudType : $(v).find('input[name="crudType"]').val()
							,atchFileId : $(v).find('input[name="atchFileIdTmp"]').val()
							,fileSize : $(v).find('input[name="fileSize"]').val()
							,fileSn : $(v).find('input[name="fileSn"]').val()
							,tempFileChk : $(v).find('input[name="tempFileChk"]').val()
							,streFileNm : $(v).find('input[name="streFileNm"]').val()
							,streFlpth : $(v).find('input[name="streFlpth"]').val()
						});
					}
				});
				return objarr;
			}
		};
        /// ACTIONS
        var ACTIONS = {
            "INIT": function () {
                // 컨트롤 버튼 이벤트 제어
                uploadView.initView();
            },
            "GET_grid": function (data) {
                return gridObj.getList(data);
            },
            "GET_uploaded": function () {
				var data={};
				if(options.atchFileId && options.atchFileId != null && options.atchFileId !== ''){

					data['atchFileId']=options.atchFileId;
                	if (sessionId)
                		data['sessionId'] = sessionId;

					// 업로드 파일 가져오기
					commonUtils.ajax({
						url: contextPath + "/cmm/fms/selectFileInfsList.do",
						data : $.param(data),
						maskTarget : options.gridTarget,
						success: function (response) {
							uploadView.setData(response);
						}
					});
				}else{
					uploadView.setData({resultData:{resultList:[]}});
				}
            },
            "DELETE_files": function (data) {
            },
            "UPDATE_uploaded": function (data) {
            	$uploadTable.find("#emptyTr").remove();
            	$.each(data,function(i,v){
            		$.each(v.result,function(i2,v2){
            			var trTmplStr=[];
            			var randomVal=Math.random().toString(36).slice(2);
            			trTmplStr.push('<tr id="'+randomVal+'">');
            			trTmplStr.push('	<input type="hidden" name="crudType" value="C">');
            			trTmplStr.push('	<input type="hidden" name="atchFileIdTmp" value="'+v2.atchFileId+'">');
            			trTmplStr.push('	<input type="hidden" name="fileSize" value="'+v2.fileSize+'">');
            			trTmplStr.push('	<input type="hidden" name="fileSn" value="'+v2.fileSn+'">');
            			trTmplStr.push('	<input type="hidden" name="tempFileChk" value="true">');
            			trTmplStr.push('	<input type="hidden" name="streFlpth" value="'+v2.streFlpth+'">');
            			trTmplStr.push('	<input type="hidden" name="streFileNm" value="'+v2.streFileNm+'">');
            			if(deleteBtn === true){
            				trTmplStr.push('	<td style="padding:0;"><input type="checkbox" name="imgCheckbox" title="선택" value="'+randomVal+'"></td>');
            				if(!smsMode)
            					trTmplStr.push('	<td><span data-crudTxt>신규</span></td>');
            			}
            			if(!smsMode)
            				trTmplStr.push('	<td overflow: hidden; style="text-align : left; padding-left: 20px;">'+v2.orignlFileNm+'</td>');

            			if(imgPreview === true){
            				if(imgFileExtsn.indexOf(v2.fileExtsn) !== -1){
            					if(smsMode)
            						trTmplStr.push('	<td style="padding: 5px;width:90%;">');
            					else
            						trTmplStr.push('	<td style="padding: 5px;">');

            					trTmplStr.push('	<img width="100%" height="100%" alt="미리보기" style="cursor:pointer" src="' + contextPath + '/cmm/fms/FileDown.do?atchFileId='+v2.atchFileId+'&fileSn='+v2.fileSn+'&tempFileChk=true" /></td>');

            				}else{
            					trTmplStr.push('	<td>없음</td>');
            				}
            			}
            			if(!smsMode){
	            			trTmplStr.push('	<td class="dis_web_tablecell">'+ax5.util.number(v2.fileSize, {byte: true})+'</td>');
	            			trTmplStr.push('	<td class="dis_web_tablecell">임시등록됨</td>');
	            			trTmplStr.push('	<td><span data-img-download data-ax5grid-cellholder="" data-ax5grid-text-align="center" style="height:25px;line-height: 19px; font-size: large; cursor:pointer;"><button title="다운로드" type="button" class="btn_file"></button></span></td>');
            			}
            			trTmplStr.push('</tr>');
            			$newTr=$(trTmplStr.join(""));

            			$newTr.find('img').click(function(){
							var _this = this;
							var viewSrc = _this.outerHTML;
							var modal=commonUtils.modal(
        						{modalId : "fileUtilsImgPreview", title:'이미지미리보기', draggable : true, maxWidth : 800, scrollable : true, html : viewSrc},
        						function(){
        							var _this = this;
        							modal_this = this;

        						}, function() {
        							// 화면 닫은 후
        							//$('#btnUserUpdatePass').focus();
        						}
            				);
            			});

            			$newTr.find('[data-img-download]').click(function(){
            				$parentTr=$(this).parents('tr');
	                    	var downloadParamObj={};
	                    	downloadParamObj={
	                    		atchFileId : $parentTr.find('input[name="atchFileIdTmp"]').val()
	                    		,fileSn : $parentTr.find('input[name="fileSn"]').val()
	                    	}
                    		if($parentTr.find('input[name="crudType"]').val() === "C")
                    			downloadParamObj['tempFileChk'] = true

                    		if (sessionId)
                    			downloadParamObj['sessionId'] = sessionId;

	                    	fileUtils.fileDownload(downloadParamObj);
            			});
            			$uploadTable.find('tbody').append($newTr);
            		});
            	})
            	ax5uploader.removeFileAll();
            }
        };
        /// uploadView
        var uploadView = {
            initView: function () {
            	$(options.target).find("[data-upload-btn]").on('click',function(){
            		switch($(this).attr("data-upload-btn")){
            			case "removeFile" :
            				var $checkedNode=$uploadTable.find('input[name="imgCheckbox"]:checked');
            				if($checkedNode.length === 0)
            					return commonUtils.alert({title : '확인',msg : '삭제하려는 항목을 체크해주세요!',theme : 'warning'});
            				$checkedNode.each(function(i,v){
            					var $currTr=$uploadTable.find("#"+v.value);
            					if($currTr.find("input[name='crudType']").val() === "C"){
            						//신규추가된 항목은 삭제처리
            						$currTr.remove();
            					}else{
            						//기존에 존재하던 항목은 삭제 플래그만 변경
            						$currTr.find("input[name='crudType']").val("D");
            						$currTr.find("[data-crudTxt]").text('삭제');
            						$currTr.find("[data-crudTxt]").parents('td').css('background','#f1f2f6');
            						$currTr.find("[data-crudTxt]").parents('td').next().css('text-decoration','line-through');
            						$currTr.css('display','none');
            					}
            				});
            				if($uploadTable.find('tbody tr').length === 0){
            					$uploadTable.find('tbody').empty().append(emptyTr);
            				}
            				$uploadTable.find('input[type=checkbox]').prop("checked",false);
            				break;
            			case "allFileDownload" :
            				var filterData=[];
            				$.each(ax5uploader.getGrid.list(), function(index,item){
            					if(item.crudType !== 'D'){
            						filterData.push(item);
            					}
            				});

            				if(filterData.length === 0){
                				commonUtils.alert({
                					msg : '다운로드 대상 첨부파일이 존재하지 않습니다.'
                					,theme : 'warning'
                				});
                            	return false;
            				}

            				var allFileDownloadParamObj = [];
            				allFileDownloadParamObj.push({name:'fileDatas',value:JSON.stringify(filterData)});

                    		if (sessionId)
                    			allFileDownloadParamObj.push({name:'sessionId',value:sessionId});

            				//전체파일 다운로드
            				fileUtils.allFileDownload({
            					data : allFileDownloadParamObj
            				});
            				break;
            		}
            	})
            },
            setData: function (response) {
            	var resultList=response.resultData.resultList;
        		if(resultList.length === 0){ //목록이 존재하지 않을 경우 '데이터없음'을 표시한다.
        			$uploadTable.find('tbody').empty().append(emptyTr);
        		}else{
        			$.each(resultList,function(i,v){
            			var trTmplStr=[];
            			var randomVal=Math.random().toString(36).slice(2);
            			trTmplStr.push('<tr id="'+randomVal+'">');
            			trTmplStr.push('	<input type="hidden" name="crudType" value="">');
            			trTmplStr.push('	<input type="hidden" name="atchFileIdTmp" value="'+v.atchFileId+'">');
            			trTmplStr.push('	<input type="hidden" name="fileSize" value="'+v.fileSize+'">');
            			trTmplStr.push('	<input type="hidden" name="fileSn" value="'+v.fileSn+'">');
            			trTmplStr.push('	<input type="hidden" name="tempFileChk" value="false">');
            			trTmplStr.push('	<input type="hidden" name="streFlpth" value="'+v.streFlpth+'">');
            			trTmplStr.push('	<input type="hidden" name="streFileNm" value="'+v.streFileNm+'">');
            			if(deleteBtn === true){
            				trTmplStr.push('	<td  style="padding:0;"><input type="checkbox" name="imgCheckbox" title="선택" value="'+randomVal+'"></td>');
            				trTmplStr.push('	<td><span data-crudTxt></span></td>');
            			}
            			trTmplStr.push('	<td style="max-width: 350px; overflow: hidden; text-align : left; padding-left: 20px;">'+v.orignlFileNm+'</td>');

            			if(imgPreview === true){
            				if(imgFileExtsn.indexOf(v.fileExtsn) !== -1){
            					if (sessionId)
            						trTmplStr.push('	<td style="padding: 5px;"><img width="100%" height="100%"  style="cursor:pointer" src="' + contextPath + '/cmm/fms/FileDown.do?atchFileId='+v.atchFileId+'&fileSn='+v.fileSn+'&sessionId=' + sessionId + '" alt="미리보기"/></td>');
            					else
            						trTmplStr.push('	<td style="padding: 5px;"><img width="100%" height="100%"  style="cursor:pointer" src="' + contextPath + '/cmm/fms/FileDown.do?atchFileId='+v.atchFileId+'&fileSn='+v.fileSn+'" alt="미리보기"/></td>');
            				}else{
            					trTmplStr.push('	<td>없음</td>');
            				}
            			}
            			if(!simpleMode){
	            			trTmplStr.push('	<td class="dis_web_tablecell">'+ax5.util.number(v.fileSize, {byte: true})+'</td>');
	            			trTmplStr.push('	<td class="dis_web_tablecell">'+v.lastUpdtDt+'</td>');
            			}
            			trTmplStr.push('	<td><span data-img-download data-ax5grid-cellholder="" data-ax5grid-text-align="center" style="height:25px;line-height: 19px; font-size: large; cursor:pointer;"><button title="다운로드" type="button" class="btn_file"></button></span></td>');
            			trTmplStr.push('</tr>');
            			$newTr=$(trTmplStr.join(""));

            			$newTr.find('img').click(function(){
							var _this = this;
							var viewSrc = _this.outerHTML;
            				var modal=commonUtils.modal(
        						{modalId : "fileUtilsImgPreview", title:'이미지미리보기', draggable : true, maxWidth : 800, scrollable : true, html : viewSrc},
        						function(){
        							var _this = this;
        							modal_this = this;

        						}, function() {
        							// 화면 닫은 후
        							//$('#btnUserUpdatePass').focus();
        						}
            				);
            			});

            			$newTr.find('[data-img-download]').click(function(){
            				$parentTr=$(this).parents('tr');
	                    	var downloadParamObj={};
	                    	downloadParamObj={
	                    		atchFileId : $parentTr.find('input[name="atchFileIdTmp"]').val()
	                    		,fileSn : $parentTr.find('input[name="fileSn"]').val()
	                    	}
                    		if($parentTr.find('input[name="crudType"]').val() === "C")
                    			downloadParamObj['tempFileChk'] = true

                        	if (sessionId)
                        		downloadParamObj['sessionId'] = sessionId;

	                    	fileUtils.fileDownload(downloadParamObj);
            			});
            			$uploadTable.find('tbody').append($newTr);
        			});
        		}
            }
        };
        ACTIONS["INIT"]();
        ACTIONS["GET_uploaded"]();

        if(ax5uploader.$progressUpload){
        	ax5uploader.$progressUpload.css('display','none');
        	ax5uploader.$progressAbort.text("중지");
        	ax5uploader.$progressAbort.click(function(){
        		if(toast.queue.length > 0){
        			toast.close();
        		}
        		var toast2 = new ax5.ui.toast({
        			containerPosition: "top-right",
        			icon : '<i class="fas fa-file-upload"></i>',
        			width : 400
        		});
        		toast2.push('파일업로드를 중지 하였습니다.');
        	})
        }
        ax5uploader.config.accept=accept;
		return ax5uploader;
	},
	fileGridUploadEx : function(options){
		if(!options){
			alert('정의된 속성이 없습니다.\ntarget속성을 정의해주세요');
			return false;
		}
		if(!options.target){
			alert('target 속성을 정의해주세요');
			return false;
		}

		var ax5uploaderId=commonUtils.getCryptoRandomVal();
		var maximunFileSize="20MB"; //개별 파일사이즈 제한
		var maximunFileSizeStr="20MB"; //개별 파일사이즈 제한
		var maximunAllFileSize="20MB"; //전체 파일사이즈 제한
		var maximunAllFileSizeStr="20MB"; //전체 파일사이즈 제한
		var maximumNumberOfFiles="1"; //최대 파일첨부 개수
		var accept=".jpg, .png, .jpeg, .gif, .bmp, .hwp, .txt, .doc, .xls, .ppt, .xlsx, .docx, .pptx, .pdf";

		if(options.maximunFileSize){
			maximunFileSize=options.maximunFileSize;
			maximunFileSizeStr=options.maximunFileSize;
		}
		if(options.maximunAllFileSize){
			maximunAllFileSize=options.maximunAllFileSize;
			maximunAllFileSizeStr=options.maximunAllFileSize;
		}

		if(options.accept)accept=options.accept;
		var maxSize=maximunFileSize.replace(/[^0-9.]/g,'');
		var maxSizeStr=maximunFileSize.replace(/[0-9.]/g,'');
		var maxAllSize=maximunAllFileSize.replace(/[^0-9.]/g,'');
		var maxAllSizeStr=maximunAllFileSize.replace(/[0-9.]/g,'');
		switch(maxSizeStr){
			case "M" :
				maximunFileSize = Number(maxSize) * 1024 * 1024;
				maximunAllFileSize = Number(maxAllSize) * 1024 * 1024;
				break;
			case "MB" :
				maximunFileSize = Number(maxSize) * 1024 * 1024;
				maximunAllFileSize = Number(maxAllSize) * 1024 * 1024;
				break;
			case "G" :
				maximunFileSize = Number(maxSize) * 1024 * 1024 * 1024;
				maximunAllFileSize = Number(maxAllSize) * 1024 * 1024 * 1024;
				break;
			case "GB" :
				maximunFileSize = Number(maxSize) * 1024 * 1024 * 1024
				maximunAllFileSize = Number(maxAllSize) * 1024 * 1024 * 1024;
				break;
		}

		var gridIndex = 0;

        var toast = new ax5.ui.toast({
            containerPosition: "top-right",
            icon : '<i class="axi axi-upload2"></i>',
            width : 400
        });

		var ax5uploaderElem=[];
		ax5uploaderElem.push('<div class="ta-l clearFix mt-15">');
		ax5uploaderElem.push('	<div class="fl-l">');
		ax5uploaderElem.push('		<span style="font-size: large;font-weight: bold;">파일</span>');
		ax5uploaderElem.push('		<div data-ax5uploader="'+ax5uploaderId+'">');
		ax5uploaderElem.push('			<input type="hidden" name="maximunFileSize" value="'+maximunFileSize+'"/>');
		ax5uploaderElem.push('			<input type="hidden" name="maximunFileSizeStr" value="'+maximunFileSizeStr+'"/>');
		ax5uploaderElem.push('			<input type="hidden" name="maximunAllFileSize" value="'+maximunAllFileSize+'"/>');
		ax5uploaderElem.push('			<input type="hidden" name="maximunAllFileSizeStr" value="'+maximunAllFileSizeStr+'"/>');
		ax5uploaderElem.push('			<input type="hidden" name="maximumNumberOfFiles" value="'+maximumNumberOfFiles+'"/>');
		ax5uploaderElem.push('			<input type="hidden" name="currentAllFilesSize" value="0"/>');
		ax5uploaderElem.push('			<input type="hidden" name="accept" value="'+accept+'"/>');
		ax5uploaderElem.push('		</div>');
		ax5uploaderElem.push('	</div>');
		ax5uploaderElem.push('	<div class="fl-r">');
		ax5uploaderElem.push('	</div>');
		ax5uploaderElem.push('</div>');
		$(options.target).append(ax5uploaderElem.join(""));

		$(options.target).find('[data-ax5uploader-button="selector"]').click(function(e){
			if(ax5uploader["__uploading"]){
    			commonUtils.alert({
    				theme : "warning"
    				,title:"파일이 업로드중입니다."
            		,msg:"업로드가 끝나고 추가 할 수 있습니다."
            	});
				e.stopImmediatePropagation();
				return false;
			}
			gridIndex = this.getAttribute("grid-index");
		});

		var $uploadTarget = $(options.target).find('[data-ax5uploader="'+ax5uploaderId+'"]');

		var uploadOptions={};
		var uploadOptions=$.extend({
            debug: false,
    		maximunFileSize:maximunFileSize,
    		maximunAllFileSize:maximunAllFileSize,
            target: $uploadTarget,
            form: {
                action: "/cmm/fms/insertTempFileInfs.do",
                fileName: "file"
            },
            accept:accept,
            progressBox: true,
            progressBoxDirection: "left",
            multiple: false,
            validateSelectedFiles: function () {
            	if(this.selectedFiles.length){
            		if(this.selectedFiles[0].size > maximunFileSize){
            			commonUtils.alert({
		    				theme : "warning"
		    				,title: "입력값을 확인해주세요."
		            		,msg: maximunFileSizeStr+" 보다 큰 파일은 업로드를 할 수가 없습니다."
		            	});
            			return false;
            		}
            	}

            	if(this.self.config.accept){
            		$uploadTarget.find('input[name="accept"]').val(this.self.config.accept);
            	}

                return true;
            },
            onprogress: function () {
             	var progress = Math.floor(this.loaded / this.total * 100);
            	ax5uploader.$progressBox.find(".progress").css('width',progress+'%');
            	ax5uploader.$progressBox.find(".progress-bar-striped").css('width','0');
            	ax5uploader.$progressBox.find("[data-percent-txt]").html(progress+'% 진행중...');

            	if(progress === 100){
            		ax5uploader.$progressBox.find("[data-percent-txt]").html(progress+'% 완료! 서버에서 파일을 처리하는 중입니다. 잠시만 기다려주세요');
                    toast.confirm('서버에 파일을 올리는 중입니다.<br>잠시만 기다려주세요.');
            	}
            },
            onuploaded: function () {
            },
            onuploaderror: function () {
            	switch(this.self.status){
            		case 401 :
            			commonUtils.alert({
            				theme : "error"
    	            		,msg:"로그인이 필요한 서비스입니다."
    	            	});
            			break;
            		case 403 :
            			commonUtils.alert({
            				theme : "error"
    	            		,msg:"권한이 없습니다."
    	            	});
            			break;
            		case 400 :
            			commonUtils.alert({
            				theme : "error"
    	            		,msg:this.self.responseText
    	            	});
            			break;
            		default :
            			commonUtils.alert({
            				theme : "error"
    	            		,msg:"파일업로드 처리중 에러가 발생하였습니다."
    	            	});
            	}
            },
            onuploadComplete: function () {
            	if(toast.queue.length > 0) toast.close();
            	switch(this.self.xhr.status){
	        		case 400 :
						commonUtils.alert({
							theme : "error"
							,msg:this.self.xhr.responseText
						});
						ax5uploader.removeFileAll();
						break;
            		case 401 :
            			commonUtils.alert({
            				theme : "error"
    	            		,msg:"로그인이 필요한 서비스입니다."
    	            	});
	        			ax5uploader.removeFileAll();
	        			break;
	        		case 400 :
            			commonUtils.alert({
            				theme : "error"
    	            		,msg:"권한이 없습니다."
    	            	});
	        			ax5uploader.removeFileAll();
	        			break;
            	}
            	ACTIONS["UPDATE_uploaded"](this.self.uploadedFiles);
            	if(this.self.xhr.status.toString().charAt(0) === "2"){
            		if(toast){
            			toast.push('임시 파일업로드가 완료 되었습니다.');
            		}else{
                        var toast2 = new ax5.ui.toast({
                            containerPosition: "top-right",
                            icon : '<i class="axi axi-upload2"></i>',
                            width : 400
                        });
                        toast2.push('임시 파일업로드가 완료 되었습니다.');
            		}
            		if(options.onuploadCompleteCallback){
            			options.onuploadCompleteCallback(this);
            		}
            	}
            }
        },options);

		var ax5uploader=new ax5.ui.uploader(uploadOptions);

        /// ACTIONS
        var ACTIONS = {
            "INIT": function () {
                // 컨트롤 버튼 이벤트 제어
                uploadView.initView();
            },
            "GET_grid": function (data) {

            },
            "GET_uploaded": function () {
            },
            "DELETE_files": function (data) {
            },
            "UPDATE_uploaded": function (data) {

            	$.each(data,function(i,v){
            		$.each(v.result,function(i2,v2){

            			$("[resultlist-row-index='"+gridIndex+"'] [name=orignlFileNm]").val(v2.orignlFileNm);
            			$("[resultlist-row-index='"+gridIndex+"'] [name=atchFileId]").val(v2.atchFileId);
            			$("[resultlist-row-index='"+gridIndex+"'] [name=fileSn]").val(v2.fileSn);
            			$("[resultlist-row-index='"+gridIndex+"'] [name=tempFileChk]").val("true");
            			$("[resultlist-row-index='"+gridIndex+"'] [grid-file-control-button='add']").remove();

            		});
            	});
            }
        };
        /// uploadView
        var uploadView = {
            initView: function () {
            },
            setData: function (response) {
            }
        };

        ax5uploader.$progressUpload.css('display','none');
        ax5uploader.$progressAbort.text("중지");
        ax5uploader.$progressAbort.click(function(){
        	if(toast.queue.length > 0){
        		toast.close();
        	}
            var toast2 = new ax5.ui.toast({
                containerPosition: "top-right",
                icon : '<i class="axi axi-upload2"></i>',
                width : 400
            });
            toast2.push('파일업로드를 중지 하였습니다.');

        })

		return ax5uploader;
	},
	//개별 첨부파일 다운로드
	fileDownload : function(options){
		commonUtils.ajax({
			url : contextPath + '/cmm/fms/FileDownloadChk.do'
			,data: $.param(options)
			,success : function(response){
				location.href=contextPath + '/cmm/fms/FileDown.do?'+$.param(options);
			}
		});
	},
	//전체 첨부파일 다운로드
	allFileDownload : function(options){
		commonUtils.ajax({
			url : contextPath + '/cmm/fms/allFileDownloadChk.do'
			,data : options.data
			,success : function(response){
				var mask=commonUtils.pageSubmit({
					url : contextPath + '/cmm/fms/allFileDown.do'
					,data : options.data
				});
			}
		});
	},
	//파일ID에 해당하는 전체 첨부파일 다운로드
	atchFileIdDownload : function(options){
		commonUtils.ajax({
			url : '/cmm/fms/selectFileInfsList.do'
			,data : $.param(options)
			,success : function(response){
    			//전체파일 다운로드
				var allFileDownloadParamObj = [];
				allFileDownloadParamObj.push({name:'fileDatas',value:JSON.stringify(response.resultData.resultList)});

        		if (options.sessionId)
        			allFileDownloadParamObj.push({name:'sessionId',value:options.sessionId});

				//전체파일 다운로드
				fileUtils.allFileDownload({
					data : allFileDownloadParamObj
				});
			}
		});
	}
}
