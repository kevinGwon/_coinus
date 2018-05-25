/**
 * 전역 객체 설정 모듈
 * set global object @iropke
 */

import UAParser from 'ua-parser-js';
import 'lib/CustomEase';

let IG = {};

IG.DEV = IG.DEV || false;

// 전역 변수 초기화
window.$ = $;
IG.width = 0;           // 창 너비
IG.height = 0;          // 창 높이
IG.headerHeight = 0;    // 헤더 높이
IG.scrollTop = 0;       // 스크롤 위치

IG.$win = $(window);

// breakpoint 상태
IG.bpState = {};

// 현재 breakpoint
IG._oldSize = -1;
IG.size = 0;
IG.bpNames = [
    'default',
    'x-small',
    'small',
    'medium',
    'large',
    'x-large',
    'xx-large'
];

// User Agent string 파싱
IG.ua = new UAParser().getResult();
console.log('[Global] UA parser:', IG.ua.ua);

window.ua = IG.ua;

// IE 구버전(버전 9 미만) 확인
IG.isLegacyIE = IG.ua.browser.name === 'IE' && (IG.ua.browser.major|0) < 9;

// IE 최신버전(IE 11 이상 및 Edge) 확인
IG.isIEEdge = (IG.ua.browser.name === 'Edge') && (IG.ua.browser.major | 0) >= 11;

// 모바일 기기 확인
IG.isMobile = (function() {
    // IE 구버전일 때
    if(IG.isLegacyIE) return false;

    // 터치 이벤트 미지원 시
    if(!Modernizr.touchevents) return false;

    // 모바일 또는 테블릿일 경우
    if($.inArray(IG.ua.device.type, ['mobile', 'tablet']) >= 0) return true;

    // 주요 데스크탑 OS일 경우
    if($.inArray(IG.ua.os.name, ['Windows', 'Mac OS']) >= 0) return false;

    // 장치 타입을 알 수 없을 경우
    if(!IG.ua.device.type) return false;

    // 아무런 해당사항이 없을 경우
    return false;
})();

// 네이버 앱 판단
IG.isNaver = (function() {
    if(!IG.isMobile) return false;

    return /NAVER\(inapp; search; \d+; [\d.]+\)/.test(IG.ua.ua);
})();

// 커스텀 easing
IG.easeOut = CustomEase.create('custom', 'M0,0 C0.05,0.57 0.1,0.74 0.22,0.86 0.35,1 0.5,1 1,1');

// requestAnimationFrame polyfill
window.requestAnimationFrame = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.msRequestAnimationFrame ||
window.oRequestAnimationFrame ||
function(callback) { window.setTimeout(callback, 1000 / 60); };

$(function() {
    IG.$doc = $(document);
    IG.$html = $('html');
    IG.$body = $('body');
    IG.$wrap = $('#wrap');
    IG.$header = $('#header');
    IG.$gnb = $('#gnb');
    IG.$sidenav = $('#sidenav');
    IG.$search = $('#global-search');
    IG.$main = $('#main');
    IG.$footer = $('#footer');
    IG.$go_top = $('#go-top');
    IG.$bp = $('<div id="bp"></div>').appendTo(IG.$body);

    // breakpoint event
    function getBreakpoint() {
        let _size = parseInt(IG.$bp.css('zIndex')) - 1;

        if ( IG.isLegacyIE ) {
            _size = 4;
        }

        if (_size !== IG.size) {
            console.log('[Global] bp:', _size, IG.bpNames[_size]);

            IG.headerHeight = Math.max(60, parseInt(IG.$body.css('border-top-width')));

            IG.size = _size;
            IG.$win.trigger('bp', IG.size);
        }

        // 창 크기를 전역 변수에 저장
        IG.width = !isNaN(IG.$win[0].innerWidth) ? IG.$win[0].innerWidth : IG.$win.width();
        IG.height = !isNaN(IG.$win[0].innerHeight) ? IG.$win[0].innerHeight : IG.$win.height();
    }

    // 디바이스/브라우저 환경 여부 클래스 삽입
    IG.$html.addClass(IG.ua.browser.name.toLowerCase());
    IG.$html.addClass(IG.ua.engine.name.toLowerCase());
    IG.$html.addClass(IG.ua.os.name.toLowerCase());
    IG.$html.addClass((!IG.isMobile ? 'no-' : '') + 'mobile');
    IG.$html.addClass((!IG.isLegacyIE ? 'no-' : '') + 'legacy-ie');
    IG.$html.addClass((!IG.isIEEdge ? 'no-' : '') + 'ie-edge');
    IG.$html.addClass((!IG.isNaver ? 'no-' : '') + 'naver');

    (IG.ua.browser.name === 'IE') && IG.$html.removeClass('svgasimg');

    // breakpoint 상수 설정 & switcher 설정
    IG.bpNames.forEach(function(el, i) {
        IG['BP_' + el.toUpperCase().replace('-', '_')] = i;
    });

    IG.$win.on('resize.breakpoint', getBreakpoint);
    getBreakpoint();

    // breakpoint trigger
    IG.$win.bp = function () {
        IG.$win.trigger('bp', IG.size);
        return this;
    };

    // 스크롤 위치를 전역 변수에 저장
    IG.$win.on('scroll.global', function () {
        IG.scrollTop = IG.$win.scrollTop();
    });

    IG.scrollTop = IG.$win.scrollTop();
});

export default IG;