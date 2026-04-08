# 항만기술기준 정보시스템 - HTML 프로토타입

## 프로젝트 개요
기존 서비스(http://digitelkr1.cafe24.com:8081)의 일부 기능을 변경하고 UI를 검토하기 위한 **정적 HTML 프로토타입**이다.
원본은 Java/.do 기반 동적 페이지이며, 이를 크롤링하여 동일한 디렉토리 구조의 정적 HTML로 재구성했다.

## 배포 환경
- **로컬 개발**: `node server.js` → http://localhost:8081 (server.js가 `.do` → `.html` 매핑 처리)
- **GitHub Pages**: https://mini531.github.io/portcals/ (정적 파일 직접 서빙)

## 핵심 아키텍처 패턴

### .do → .html URL 매핑
원본 시스템의 `.do` URL을 `.html`로 매핑한다.
- 로컬: `server.js`에서 `.do` 요청을 `.html` 파일로 매핑
- GitHub Pages: 모든 링크를 `.html`로 변환 + `gotoMenuLink`/`pageSubmit` 오버라이드

### commonUtils 오버라이드 패턴
각 HTML 페이지에서 `commonUtils.js` 로드 직후 다음 함수들을 오버라이드한다:
```javascript
var _basePath = location.pathname.indexOf('/portcals/') === 0 ? '/portcals' : '';
var gotoMenuLink = function(menuNo, menuUrl) { location.href = _basePath + menuUrl.replace(".do", ".html"); };
commonUtils.ajax = function(options) {};
commonUtils.showMask = function() {};
commonUtils.closeMask = function() {};
commonUtils.alert = function(o,cb) { if(cb) cb.call({key:'ok'}); };
commonUtils.pageSubmit = function(options) {
  if (!options || !options.url) return;
  var params = [];
  if (options.data) { $.each(options.data, function(i,v) { params.push(encodeURIComponent(v.name)+'='+encodeURIComponent(v.value)); }); }
  location.href = _basePath + options.url.replace(".do", ".html") + (params.length ? '?' + params.join('&') : '');
};
$(document).ajaxError(function(e){ e.stopPropagation(); });
```

### GitHub Pages basePath
GitHub Pages에서는 `/portcals/` 하위에 배포되므로, 절대 경로 앞에 `_basePath`를 붙여야 한다.
- `_basePath`는 `location.pathname`이 `/portcals/`로 시작하면 `'/portcals'`, 아니면 `''`
- index.html의 링크는 상대 경로(leading `/` 없이) 사용

### 탭 전환
`commonUtils.addTabCtrl`는 `#tab-select` 요소가 없으면 실패한다. 직접 jQuery 클릭 핸들러로 대체:
```javascript
$('#tab-button').find('a').on('click', function(e) {
    e.preventDefault();
    var tabId = $(this).attr('href');
    $('#tab-button li').removeClass('active');
    $(this).parent().addClass('active');
    $('.tab_content3').hide();
    $(tabId).show();
});
```

## 주요 페이지

| 경로 | 설명 |
|------|------|
| `index.html` | 랜딩 페이지 (각 화면 링크) |
| `cost/selectStdMrpOrgListVw.html` | 공사비 정보 > 표준시장단가 원문 목록 |
| `cost/selectStdMrpOrgDetailVw.html` | 표준시장단가 조회 (원문/요약본/통계 탭) |
| `cost/pdfViewerEmbed.html` | 헤더 없는 PDF 뷰어 (iframe용) |
| `mng/std/selectStdListVw.html` | 관리 > 표준시장단가 관리 목록 |
| `mng/std/selectMrpDtlVw.html` | 관리 상세 (문서정보/요약본 탭) |
| `mng/std/selectStdInsertVw.html` | 등록 페이지 |
| `mng/std/selectStdUpdateVw.html` | 수정 페이지 |

## 주요 리소스

| 경로 | 설명 |
|------|------|
| `upload/std/2025상반기.pdf` | PDF 원문 파일 (3.4MB) |
| `plugin/pdfjs/` | PDF.js 라이브러리 (pdf.min.js, pdf.worker.min.js) |
| `plugin/echarts/echarts.min.js` | Apache ECharts 5.5.0 (통계 차트용) |
| `server.js` | 로컬 개발 서버 (.do→.html 매핑) |

## 주의사항

### 반복된 실수 방지
- **sed/replace 중복 적용 금지**: `.do` → `.html` 치환을 여러 번 적용하면 `".html")/, ".html$1")`처럼 깨진다. 치환 전 이미 적용되었는지 확인할 것.
- **menu.js 비활성화**: 원본의 `menu.js`는 GNB를 동적 생성하므로 프로토타입에서는 주석 처리. 대신 HTML에 직접 메뉴를 작성하고 `gotoMenuLink` 인라인 정의.
- **fileUtils.fileUpload 비활성화**: 일부 관리 페이지에서 동적 제목 생성과 정적 HTML 제목이 중복되므로 비활성화.
- **CRLF/LF 주의**: Windows 환경이므로 줄바꿈 형식 차이로 문자열 매칭 실패할 수 있다.

### CSS/JS 원본 참조
CSS, JS, 이미지 등 정적 리소스는 원본 서버(digitelkr1.cafe24.com:8081)의 것을 그대로 사용한다.
GitHub Pages에서는 이 외부 리소스가 로드되지 않아 스타일이 깨질 수 있다.
로컬 server.js에서는 프록시하여 제공한다.

### GNB 활성 메뉴
- `cost/` 페이지들: 공사비 정보 메뉴에 `active` 클래스
- `mng/` 페이지들: 관리 메뉴에 `active` 클래스
