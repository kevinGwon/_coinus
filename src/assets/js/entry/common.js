/**
 * 전체 페이지 공통 실행 스크립트
 * common
 */

import IG from 'module/global';
import Util from 'module/util';
import 'module/dropdown';

class Common {
    constructor() {
    }

    /**
     * 전체 페이지 공통 초기화
     */
    init() {
        this.autoFocus();
        this.skipNav();
        this.legacyBrowser();

        console.log('[Common on]');
    }

    /**
     * 자동 포커스 요소에 포커스 부여
     */
    autoFocus() {
        $('[autofocus]:not(:focus)').eq(0).focus();
    }

    /**
     * 본문 바로가기 링크 작동
     */
    skipNav() {
        let $target,
            isTargetMain = true;

        if($('#main').length) {
            $target = $('#main');
            isTargetMain = false;
        } else {
            $target = IG.$main;
        }

        $target.on('focusout', function() {
            $target.removeAttr('tabindex');
        });

        $('#skipnav').on('click', function(event) {
            $target
                .attr('tabindex', '-1')
                .focus();

            // 본문 대상 요소가 main 요소가 아닐 경우 스크롤 위치 조정
            if(!isTargetMain) {
                IG.$doc.scrollTop( IG.$doc.scrollTop() - IG.$header.height() - 1 );
            }

            event.preventDefault();
        });
    }

    /**
     * 미지원 브라우저 사용 시 메시지 출력
     */
    legacyBrowser() {
        let $msg = $('#legacy-browser'),
            $closeBtn = $msg.find('.legacy-browser-close');

        // 메시지가 출력되어 있지 않을 경우 종료
        if(!$msg.length) {
            return;
        }

        // 쿠키에 값이 설정되어 있다면 메시지 삭제
        if(Util.getCookie('legacy-msg')) {
            $msg.remove();

            return;
        }

        // 메시지 보여주기
        $msg.show();

        // 닫기 버튼 눌렀을 때 쿠키에 1일 동안 값 설정하고 메시지 삭제
        $closeBtn.on('click', function() {
            Util.setCookie('legacy-msg', true, 1);
            $msg.remove();
        });
    }

}

$(function() {
    new Common();
});
