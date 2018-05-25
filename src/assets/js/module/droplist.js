/**
 * Event > list
 */

'use strict';

var IG = require('../module/global');
var Ease = require('gsap/src/uncompressed/easing/EasePack');

require('../module/inview');

var droplist = (function(){
    function droplist($el) {
        this.$el = $el;
        this.init() && this.$el.length;
    }
    droplist.prototype = {
        init: function() {
            var self = this;

            self.setup = self.$el.data('droplist');
            self.$item = self.$el.find('.thumb');

            self.HALF = 2;
            self.TRIPLE = 3;

            self.DUR = 0.6;
            self.DEL = 0;

            self.column = self.setup > self.HALF ? true : false;

            ( self.setup ) && self.inview();
        },
        getItem: function($thumb) {
            var $item = $thumb,
                $itemLayer = null,

                src = $item.data('src');

            //prototype 중복방지
            if($item.find('.thumb-layer').length) return;

            //bg init
            $item.append('<div class="thumb-layer" style="background-image: url('+ src +')"></div>');
            $itemLayer = $item.find('.thumb-layer');

            //motion set
            // TweenMax.set($itemLayer, { height: 0 });
            TweenMax.set($item, { yPercent: -101 });
            TweenMax.set($itemLayer, { yPercent: 101 });
            TweenMax.set($item.next(), {
                // yPercent: -25,
                autoAlpha: 0
            });
        },
        inview: function() {
            var self = this;

            self.$item.each(function(i, el){
                var $el = $(el),
                    $elParent = $el.parent();

                self.getItem($el);

                $elParent.one('inview', {offset: 0.85}, function(){
                    var $target = $(this),
                        $targetThumb,
                        $targetBg,
                        $cont,

                        tl = new TimelineMax();

                    //각각의 이미지 set
                    // self.getItem($thumb);

                    //column 개수에 따라 딜레이 초기화
                    function half() {
                        if(self.DEL > self.HALF - 1) {
                            self.DEL = 0;
                        }
                    }
                    function triple() {
                        if(self.DEL > self.TRIPLE - 1) {
                            self.DEL = 0;
                        }
                    }

                    self.column ? triple() : half();

                    TweenMax.delayedCall( self.DEL*self.DUR/2, function() {
                        $targetThumb = $target.find('.thumb');
                        $targetBg = $target.find('.thumb-layer');
                        $cont = $targetThumb.next();

                        $target.addClass('is-active');

                        tl
                        .to($targetThumb, self.DUR, {
                            yPercent: 0,
                            ease: Ease.Circ.ease
                        })
                        .to($targetBg, self.DUR, {
                            yPercent: 0,
                            ease: Ease.Circ.ease
                        }, '-='+self.DUR)
                        .to($cont, self.DUR, {
                            autoAlpha: 1,
                            delay: self.DUR,
                            ease: Ease.Circ.ease
                        }, '-='+self.DUR*2);
                    });

                    //desktop delay설정
                    if(!IG.isMobile) {
                        self.DEL += 1;
                    }
                });
            });
        }
    };
    return droplist;
})();

module.exports = new droplist( $('[data-droplist]') );
