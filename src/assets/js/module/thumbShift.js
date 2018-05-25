/**
 * Event > view
 */

'use strict';

var IG = require('./global');

var View = (function(){

    function View() {
    }

    View.prototype = {
        init: function() {
            this.shift();
        },

        shift: function() {
            // requestAnimationFrame polyfill
            window.requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function(callback) { window.setTimeout(callback, 1000 / 60); };

            var $img = $('[data-shift] img'),
                scrollCenter;

            if ( !$img.length ) return;

            function setInview() {
                var scrollBottom = IG.scrollTop + IG.height;

                scrollCenter = IG.scrollTop + IG.headerHeight + (IG.height - IG.headerHeight) / 2;

                var range,
                    diff,
                    shift,

                    imgOffsetTop = $img.data('imgOffsetTop'),
                    imgOffsetBottom = $img.data('imgOffsetBottom');

                if(scrollBottom > imgOffsetTop && IG.scrollTop < imgOffsetBottom) {
                    $img.addClass('is-inview');
                    $img.addClass('is-animate');
                } else {
                    $img.removeClass('is-inview');
                    $img.data('is-force', true);

                    return true;
                }

                range = $img.data('range');
                diff = scrollCenter - $img.data('offsetCenter');
                shift = diff / (IG.height - IG.headerHeight) * range;
                $img.data('shift', shift);
            }

            function getPosition() {
                var $container = $img.parents('.l-wrap'),

                    range = -parseInt(70) * 0.5,
                    offsetTop = $container.offset().top,
                    containerHeight = $container.height(),

                    imgOffsetTop = $img.parent().offset().top;

                $img.data('imgOffsetTop', imgOffsetTop);
                $img.data('imgOffsetBottom', imgOffsetTop + $img.parent().height());
                $img.data('range', range);
                $img.data('offsetCenter', offsetTop + containerHeight / 2);
            }

            function update() {
                $img.filter('.is-inview.is-animate').each(function() {
                    var $this = $(this),
                        y = $this.get(0)._gsTransform.y;

                    y += ($this.data('shift') - y) * 0.1;

                    if(Math.abs($this.data('shift') - y) <= 0.5 || $this.data('is-force')) {
                        y = $this.data('shift');
                        $this.removeClass('is-animate');
                        $this.data('is-force', false);
                    }

                    TweenMax.set($this, {
                        y: y,
                        scale: 1.25
                    });
                });

                requestAnimationFrame(update);
            }

            // 이미지 위치, 속성 초기화
            TweenMax.set($img, {
                y: 0
            });

            $img.data('is-force', true);

            IG.$win.scroll(setInview);
            IG.$win.resize(getPosition);

            getPosition();
            setInview();
            update();

            // 페이지 전체 리소스 로딩이 끝났을 때 다시 초기화
            IG.$win.load(function() {
                getPosition();
                setInview();
            });
        }
    };

    return View;
})();

$(function() {
    var view = new View();

    view.init();
});
