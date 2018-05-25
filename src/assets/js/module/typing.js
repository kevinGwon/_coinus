/**
* typing
* @author: kevin@iropke.com
* @releases: 2017.12.12
* @dependency: [jquery]
*/
'use strict';

var IG = require('../module/global');

var Typing = (function() {
    var defaults = {
        focusClass: 'is-focus',
        placeholderClass: 'is-placeholder',
        searchSelector: '.input-search',
        speed: 160
    };

    $.fn.typing = function(opt) {

        if (this.length > 1) {
            this.each(function(){ $(this).typing(opt); });
            return this;
        }

        var obj = {};
        var self = this;

        var init = function() {
            obj.o = $.extend({}, defaults, opt);

            obj.$el = $(self);
            obj.$search = self.find(obj.o.searchSelector);
            obj.$typingTarget = null;

            obj.placeholder = obj.$search.attr('data-placeholder') ? obj.$search.attr('data-placeholder') : '검색어를 입력해 주세요';
            obj.getKeyword = obj.$search.data('keyword');

            obj.SPEED = obj.o.speed;

            if (!obj.$search.length) return;

            var arrKeywords = obj.getKeyword.split(','),

                keyCount = 0,
                keyIndex = 0,

                limKeywords, timeout;

            if(obj.getKeyword.slice(-1) === ',') {
                //키워드 마지막 ','제거 후 재등록
                arrKeywords.pop();
                obj.getKeyword = obj.getKeyword.slice(0, -1);

                obj.$search.attr('data-keyword', obj.getKeyword);
            }

            limKeywords = arrKeywords.length - 1;
            obj.$el.find('.keyword').length === 0 && obj.$el.append('<span class="keyword">'+ obj.placeholder +'</span>');
            obj.$typingTarget = obj.$el.find('.keyword');

            function runWrite() {
                clearTimer();
                timeout = setTimeout(runWrite, obj.SPEED);
                typing(++keyCount);
            }
            function runDelete() {
                clearTimer();
                timeout = setTimeout(runDelete, obj.SPEED/2);
                typing(--keyCount);
            }
            function runTyping() {
                clearTimer();
                runWrite();

                obj.$el.addClass('is-keyword');
                obj.$el.removeClass('is-typing', obj.o.placeholderClass);
            }
            function typing(current) {
                // 키워드 갯수 초기화
                (limKeywords < keyIndex) && (keyIndex = 0);

                // 키워드 순서대로 typing실행
                obj.$typingTarget.text(arrKeywords[keyIndex].trim().substring(0, current));

                // 키워드 typing방향 판별
                if ( current > arrKeywords[keyIndex].trim().length ) {
                    clearTimer();

                    TweenMax.delayedCall(obj.SPEED/500, function() {
                        runDelete();
                    });
                } else if ( current < 0 ) {
                    keyIndex++;
                    runWrite();
                }
            }
            function clearTimer() {
                clearTimeout(timeout);
            }
            function init(type) {
                obj.$el.removeClass(obj.o.placeholderClass);

                if (obj.$search.val().length === 0) {
                    runTyping();
                }
                else if (obj.$search.val().length !== 0 && type === 'keyup') {
                    reset();
                }
            }
            function reset() {
                TweenMax.killAll();
                clearTimer();
                keyCount = 0;
                obj.$typingTarget.text('');

                //텍스트 고정 클래스명
                obj.$el.removeClass('is-keyword');

                //검색중 클래스명
                if(obj.$search.val().length !== 0) {
                    obj.$el.addClass('is-typing');
                }
            }
            function placeholderInit() {
                // 초기 진입시 검색어 값이 존재 한다면 placeholder hide
                if (obj.$search.val().length !== 0) {
                    obj.$typingTarget.text('');
                } else {
                    obj.$el.addClass(obj.o.placeholderClass);
                }
            }

            // Firefox - keyup & keydown 한글 미지원으로 typing 작동분리
            if (IG.$html.is('.Firefox')) {
                placeholderInit();
                obj.$search.on({
                    'focus': function() {
                        obj.$el.removeClass(obj.o.placeholderClass);
                        obj.$el.addClass(obj.o.focusClass);
                        obj.$typingTarget.text('');
                    },
                    'focusout': function() {
                        obj.$el.removeClass(obj.o.focusClass);

                        if (obj.$search.val().length === 0) {
                            obj.$el.addClass(obj.o.placeholderClass);
                            obj.$typingTarget.text(obj.placeholder);
                        }
                    }
                });
            } else {
                placeholderInit();
                obj.$search.on({
                    'keyup keydown': function(e) {
                        init(e.type);
                    },
                    'focus': function() {
                        init();
                        obj.$el.addClass(obj.o.focusClass);
                    },
                    'focusout': function() {
                        reset();
                        obj.$el.removeClass(obj.o.focusClass);

                        if (obj.$search.val().length === 0) {
                            keyCount = 0;
                            obj.$typingTarget.text(obj.placeholder);
                        }
                        //placeholder 클래스명 추가
                        if(!obj.$el.hasClass('is-keyword') && obj.$search.val().length === 0) {
                            obj.$el.addClass(obj.o.placeholderClass);
                        }
                    }
                });
            }

            obj.$typingTarget.on('click', function() {
                obj.$search.focus();
            });
        };

        init();

        return this;
    };
})();

module.exports = Typing;
