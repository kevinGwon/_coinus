/**
 * 전체 페이지 공통 실행 스크립트
 * common
 */

import IG from 'module/global';
import Util from 'module/util';
import Nav from 'module/nav';
// import TopNotice from 'module/top-notice';
// import Notify from 'module/notify';
// import 'module/selectbox';
// import Textarea from 'module/textarea';
// import 'module/vertical-center';
import 'lib/jquery.ytiframe';
import 'jquery.easing';

class Common {
    constructor() {
        this.nav = new Nav();
        // this.topNotice = new TopNotice();
        // this.notify = new Notify();

        // IG.notify = this.notify;
        // window.Textarea = Textarea; // textarea 클래스 외부 호출용
    }

    /**
     * 전체 페이지 공통 초기화
     */
    init() {
        this.nav.init();
        // this.topNotice.init();
        // this.notify.init();

        // $('.selectbox').selectbox();
        // $('.list-select').selectbox({
            // classPrefix: 'list-select'
        // });
        // $('.v-center').verticalCenter();

        this.setScrollPos();
        this.setMainHeight();
        this.autoFocus();
        this.button();
        this.attachFile();
        this.initYTPlayer();
        this.skipNav();
        this.legacyBrowser();
        this.goToTop();
        this.setFooterFolding();

        // $('.textarea-container > textarea').each(function() {
        //     let $this = $(this);

        //     new Textarea($this);
        // });
    }

    /**
     * hash 태그 존재할 경우 해당 요소로 스크롤 위치 맞추기
     */
    setScrollPos() {
        function update() {
            pos = $target.offset().top;

            if(pos === 0) {
                return;
            }

            IG.$win.scrollTop(pos - (IG.$header.height() + 20));
        }

        if(!location.hash) {
            return;
        }

        let hash = location.hash,
            $target = $(hash),
            pos = 0,
            scrollInt;

        if(!$target.length) {
            return;
        }

        scrollInt = setInterval(update, 50);

        setTimeout(function() {
            clearInterval(scrollInt);
        }, 500);
    }

    /**
     * 메인 요소 최소 크기 지정
     */
    setMainHeight() {
        let mainPadding = parseInt(IG.$main.css('padding-top')),
            footerHeight = IG.$footer.outerHeight();

        Util.resize(function() {
            mainPadding = parseInt(IG.$main.css('padding-top'));
            footerHeight = IG.$footer.outerHeight();

            IG.$main.css('min-height', IG.height - (mainPadding + footerHeight));
        });
    }

    /**
     * 자동 포커스 요소에 포커스 부여
     */
    autoFocus() {
        $('[autofocus]:not(:focus)').eq(0).focus();
    }

    /**
     * 버튼 라벨 감싸기
     */
    button() {
        $('.btn').not('.btn--no-icon').each(function() {
            let $this = $(this),
                html = $this.html();

            $this.html(`<span>${html}</span>`);
        });
    }

    attachFile() {
        let $attachFile = $('.attach-file');

        if(!$attachFile.length) {
            return;
        }

        $attachFile.find('.attach-file-input').after('<span class="attach-file-focus"></span>');
    }

    /**
     * Youtube player 작동
     */
    initYTPlayer() {
        $('.yt-player').on('click', function(event) {
            let $caption = $(this).parent().is('div') ?
                    $(this).parent().next('.media-subtitle') :
                    $(this).next('.media-subtitle');

            // 비디오 재생시 캡션 보이주기
            $caption.addClass('is-play');

            $(this).ytiframe({
                autoplay: true
            });
            event.preventDefault();
        });
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

    /**
     * 내용 처음으로 가기
     */
    goToTop() {
        let $topBtn = $('#go-to-top'), // 버튼 요소
            docHeight = 0, // 문서 전체 높이
            footerHeight = 0; // footer 높이

        /**
         * 버튼이 footer 위에서 멈추도록 만들기
         */
        function toggleSticky() {
            let toggle;

            docHeight = IG.$doc.height();
            footerHeight = IG.$footer.outerHeight();

            // footer 전까지 스크롤 위치 계산
            toggle = IG.scrollTop > (docHeight - footerHeight - IG.height);

            $topBtn.toggleClass('is-sticky', toggle);
        }

        // 메인에서는 페이지 하단에만 노출
        if (IG.$main.hasClass('page-main')) {
            $topBtn.addClass('is-show').addClass('is-sticky');
        } else {
            // 페이지를 200px 스크롤 할 때부터 버튼 표시
            IG.$win.on('scroll', function() {
                $topBtn.toggleClass('is-show', IG.scrollTop >= 200);
            });

            // 리사이징 시 footer 높이 다시 계산
            Util.resize(toggleSticky);
            IG.$win.on('scroll', toggleSticky);

        }

        // 클릭 시 페이지 최상단으로 스크롤하고 메인 요소로 포커스 옮기기
        $topBtn.on('click', function(event) {
            $('html, body').animate({ scrollTop: 0 }, 400, 'easeInOutExpo', function() {
                IG.$main.attr('tabindex', '-1').focus();
            });
            event.preventDefault();
        });
    }

    /**
     * footer 영역 접기/펼치기 기능 적용
     */
    setFooterFolding() {
        let $toggle = $('#footer-toggle'),
            $contents = $('#footer-contents'),
            $relatedLink = IG.$footer.find('.related-link'),

            isOpened = false;

        /**
         * 접기/펼치기
         * @param toggle
         */
        function toggle(toggle) {
            toggle = typeof toggle === 'undefined' ? !isOpened : toggle;

            isOpened = toggle;

            $contents['slide' + (toggle ? 'Down' : 'Up')]({
                duration: 250,
                progress: function() {
                    if(!toggle) {
                        return;
                    }

                    IG.$doc.scrollTop(IG.$doc.height());
                }
            });

            IG.$footer.toggleClass('is-opened', toggle);
        }

        $toggle.on('click', () => {
            toggle();
        });

        Util.resize(() => {
            let $items = $relatedLink.children(),
                offset;

            $items.removeClass('is-newline');

            $items.each(function() {
                let $this = $(this),
                    itemOffset = $this.offset().top;

                if(typeof offset === 'number' && itemOffset > offset) {
                    $this.addClass('is-newline');
                }

                offset = itemOffset;
            });
        });
    }
}

let common = new Common();

$(function() {
    common.init();
});
