var _menuTreeList=[];
var gMenuLink = new Map();

var gotoMenuLink = function(menuNo,menuUrl){
	commonUtils.showMask($("#contentWrap"));
	location.href = contextPath + menuUrl;
}

$(document).ready(function(){
	var selectedMenuId = null;
	var pathname = location.pathname;
	pathname = pathname.replace(contextPath, "");

	// 대표 URL
	for(var i = 0; i < _menuFnctList.length; i += 1) {
		var menuFnct = _menuFnctList[i];
		if (menuFnct.menuFnctUrl === pathname) {
			if (menuFnct.menuFnctReprsntUrl)
				pathname = menuFnct.menuFnctReprsntUrl;

			break;
		}
	}

	// 현재 URL
	var currentUri = '/'+(pathname + location.search).substr(1);

	//GNB 메뉴를 만든다.
	var map = {}, nodes=_menuList, roots = [];
	for (var i = 0; i < nodes.length; i += 1) {
	    var node = nodes[i];
		node.children = [];
	    map[node.menuNo] = i;

	    if(node.url && currentUri.startsWith(node.url)){
	    	selectedMenuId = node.menuNo;
	    }

	    if (node.upperMenuNo !== "root") {
	        nodes[map[node.upperMenuNo]].children.push(node);
	    } else {
	        roots.push(node);
	    }
	}

	_menuTreeList=roots;
	var gnbPcMenu=[]; //웹 헤더 메뉴
	var num = 1;
	$.each(roots,function(i,v){
		/* 1depth */
		if( v.hderHideAt === "N"){

			if(i==0)
				gnbPcMenu.push("<li class='left_line'>" );
			else
				gnbPcMenu.push("<li>" );

			gnbPcMenu.push("<a href='javascript:;' class='right_line'><span class='large_menu'>"+v.menuNm+"</span></a>");
			num++;

			if(i==0)
				gnbPcMenu.push("<ul class='sub_mm' style='border-left: 1px solid #dcdcdc;'>");
			else
				gnbPcMenu.push("<ul class='sub_mm'>");

			/* 2depth */
			$.each(v.children,function(i2,v2){

				if (i2 == 0) {
					gMenuLink.set(v.menuNm, v2.url);
				}
				if(_insttSe === "04") {
					if(v2.menuNm==="기술자문(신기술활용심의)위원등록") v2.menuNm = "항만시설기술기준전문가위원등록";
				}

                let menuNm = v2.menuNm;
                if (menuNm == null) menuNm = '';
                menuNm = String(menuNm);

				/*const hasKeyword = (typeof menuNm.includes === 'function')
					? menuNm.includes("신기술활용심의")
					: menuNm.indexOf("신기술활용심의") !== -1;

				if (menuNm.length > 13 && hasKeyword) {
					console.log("menuNm : " + menuNm);
					menuNm = menuNm.substring(0, 13) + "<br>"+menuNm.substring(13, menuNm.length);
				}*/


				if( v2.hderHideAt === "N"){
					gnbPcMenu.push("<li>");
					if(v2.url) {
						gMenuLink.set(v2.menuNm, v2.url);
						gnbPcMenu.push('<a href="javascript:;" data-nav-menu-no=\''+v2.menuNo+'\' onclick="javascript:gotoMenuLink(\''+v2.menuNo+'\',\''+v2.url+'\')">'+menuNm+'</a>');
					} else {
						gnbPcMenu.push("<a href='javascript:;' onclick='return false;'>"+menuNm+"</a>");
					}
					gnbPcMenu.push("</li>");
				}
			})
			if(v.children.length > 0){
				gnbPcMenu.push("</ul>");
			}
			gnbPcMenu.push("</li>");
		}
	});

	$("#wrap-web-ul").prepend(gnbPcMenu.join(""));

	// 사이트맵 만들기
	var sitemapMenu=[]; //웹 헤더 메뉴
	$.each(roots,function(i,v){
		if(v.hderHideAt === "N"){

			sitemapMenu.push("<li><a><span>" + v.menuNm + "</span></a>");
			sitemapMenu.push("<div class='sitemap_subList'><ul>");

			$.each(v.children,function(i2,v2){
				if(v2.hderHideAt === "N"){
					sitemapMenu.push("<li>");
					sitemapMenu.push('<a href="javascript:;" onclick="javascript:gotoMenuLink(\'' + v2.menuNo + '\',\'' + v2.url + '\')">');

					sitemapMenu.push("<span>" + v2.menuNm + "</span>");

					sitemapMenu.push("</a>");
					sitemapMenu.push("</li>");
				}
			});

			sitemapMenu.push("</ul></div>");
			sitemapMenu.push("</li>");
		}
	});
	$(".sitemap_list").html(sitemapMenu.join(""));

	//메뉴 쿠키 정보를 불러와서 LEFT 메뉴 및 네비게이션을 만든다.
	var loopBreakFlag=false;
	var selectedNav=[];
	if(selectedMenuId && selectedMenuId !== null){
		$.each(_menuTreeList,function(i,v){
			selectedNav[0]={menuNm : v.menuNm, menuNo : v.menuNo, sortOrdr : v.sortOrdr};
			if(v.menuNo === selectedMenuId){
				loopBreakFlag=true;
				return false;
			}
			$.each(v.children,function(i2,v2){
				selectedNav[1]={menuNm : v2.menuNm, menuNo : v2.menuNo, sortOrdr : v2.sortOrdr};
				if(v2.menuNo === selectedMenuId){
					loopBreakFlag=true;
					return false;
				}
				$.each(v2.children,function(i3,v3){
					if(v3.menuNo === selectedMenuId){
						selectedNav[2]={menuNm : v3.menuNm, menuNo : v3.menuNo, sortOrdr : v3.sortOrdr};
						loopBreakFlag=true;
						return false;
					}
				});
				if(loopBreakFlag)return false;
			});
			if(loopBreakFlag)return false;
		});
	}

	var menu1;
	var menu2;
	var menu3;
	var menu_path;
	var sub_top_tit;
	var navMenu=[];
	var depth2=[];
	var depth3=[];

	if(selectedNav != null && selectedNav[0] != null){
		$.each(nodes,function(i,v){
			if(v.menuDepth === 1 && v.menuNo === selectedNav[0].menuNo){
				//alert(selectedNav[0].menuNo);
				depth2=v.children;
			}
		});

		// jsp 제목
		$(".left_top_tit").text(selectedNav[0].menuNm);
		menu1 = selectedNav[0].menuNm;

		if(selectedNav[0]){
			if(selectedNav[1]){

				menu2 = selectedNav[1].menuNm;
				//화면경로
				menu_path = "<li><span class='navi_st_txt'>" + menu1 + " </span></li>"
						  + "<li><span class='navi_st_txt'>" + menu2 + " </span></li>"
				sub_top_tit = menu2; //화면명

				if(selectedNav[2]){
					menu3 = selectedNav[2].menuNm;
					//화면경로
					menu_path = "<li><span class='navi_st_txt'>" + menu1 + " </span></li>"
					          + "<li><span class='navi_st_txt'>" + menu2 + " </span></li>"
					          + "<li><span class='navi_st_txt'>" + menu3 + "</span></li>";
					sub_top_tit = menu3; //화면명
				}

				$.each(depth2,function(i2,v2){


					if(v2.children.length === 0){ //3depth 메뉴 없을때
						if(v2.menuNo === selectedNav[1].menuNo)
							navMenu.push("<li class='active'>");
						else
							navMenu.push("<li>");

						navMenu.push('<a href="javascript:;" data-nav-menu-no=\''+v2.menuNo+'\' onclick="javascript:gotoMenuLink(\''+v2.menuNo+'\',\''+v2.url+'\')" data-nav-menu-no="'+v2.menuNo+'" data-nav-menu-level="2">'+v2.menuNm+'</a>');

					}else{ //3depth 메뉴 있을때
						if(v2.menuNo === selectedNav[1].menuNo)
							navMenu.push('<li class="has_sub active"><a href="#"><span>' + v2.menuNm+ '</a>');
						else
							navMenu.push('<li class="has_sub"><a href="#"><span>' + v2.menuNm+ '</a>');
						navMenu.push("<ul>");

						$.each(v2.children,function(i3,v3){
							if(selectedNav[2] && v3.menuNo === selectedNav[2].menuNo){
								navMenu.push("<li class='active'>");
							}
							else
								navMenu.push("<li>");
							navMenu.push('<a href="javascript:;" data-nav-menu-no=\''+v3.menuNo+'\' onclick="javascript:gotoMenuLink(\''+v3.menuNo+'\',\''+v3.url+'\')" data-nav-menu-no="'+v3.menuNo+'" data-nav-menu-level="2">'+v3.menuNm+'</a>');
							navMenu.push("</li>");
						});

						navMenu.push("</ul>");

					}

					navMenu.push("</li>");

				});
			}
		}

		$("#sub_top_tit").html(sub_top_tit);
		$("#wrap-small-nav-ul").html("<li><span class='navi_st_txt'>Home</span></li>" + menu_path);

		// title 기능에 맞게 변경
		$("title").text(sub_top_tit + " " + $("title").text());

		$("#leftMenu-ul").empty().append(navMenu.join(""));

		// 현재 메뉴 라인 그리기
		$('.large_menu').removeClass("large_menu_active");
		$('.large_menu').filter(function() {
			return $(this).text().trim() === menu1;
		}).addClass("large_menu_active");
	}

	$(".navi_st_txt").click(function(){
		let menuNm = $(this).text().trim();
		let menuUrl;

		if (menuNm == "Home") {
			menuUrl = "/main/index.do";
		} else {
			menuUrl = gMenuLink.get(menuNm)
		}

		if (menuUrl) {
			location.href = contextPath + menuUrl;
		}
	});
})


$(function(){
	$("#wrap-web-ul>li>a").on("focusin", function(){
		let width = $("body").width() + 17;
		if (width > 999) {
			$(this).parents('li').addClass('hover');
			$(".sub_menu_mc").show();
			$(".sub_mm").show();
		}
	});

	$("#wrap-web-ul>li>ul>li>a").on("focusin", function(){
		let width = $("body").width() + 17;
		if (width > 999) {
			$(this).parents('li').parents('ul').parents('li').addClass('hover');
		}
	});

	$("#wrap-web-ul>li").on("focusout", function(){
		$(this).removeClass('hover');
	});

	$('*:not("#wrap-web-ul a")').focus(function(){
		$(".sub_menu_mc").hide();
		$(".sub_mm").hide();
		$("#menu").removeClass("active");
	});
});

