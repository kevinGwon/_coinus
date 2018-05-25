/**
* Stickys js
* @author: sherlock@iropke.com
* last updat: 2017.07.23
*/
'use strict';

var IG = require('../module/global');

function Stickys($el) {
    this.$el = $el;
    this.init();
}

Stickys.prototype = {
    init: function() {
        var self = this,
            prevScroll = 0, currentScroll, scr, dir;

        IG.$win.on('scroll', function(){
            currentScroll = IG.$win.scrollTop();

            dir = ( prevScroll > currentScroll ) ? 'up' : 'down';

            scr = prevScroll = currentScroll;

            self.action(dir, scr);
        });
    },
    action: function(dir, scr) {
        var self = this;

        dir === 'up' ? self.up(scr) : self.down(scr);
    },
    up: function(scr) {
        var self      = this,
            selfTop   = self.$el.offset().top,
            parentTop = self.$el.parent().offset().top;

        if ( !self.$el.data('px-reverse') ) {
            if ( scr <= selfTop && scr >= parentTop ) {
                TweenMax.set(self.$el, {className: '-=done-active'});
                TweenMax.set(self.$el, {className: '+=is-active'});
            }

            ( scr <= parentTop ) && TweenMax.set(self.$el, { className: '-=is-active' });
        } else {
            if ( scr + IG.$win.height() <= selfTop + self.$el.outerHeight() ) {
                TweenMax.set(self.$el, {className: '-=done-active'});
                TweenMax.set(self.$el, {className: '+=is-active'});
            }

            ( selfTop <= parentTop ) && TweenMax.set(self.$el, { className: '-=is-active' });
        }

    },
    down: function(scr) {
        var self        = this,
            selfTop     = self.$el.offset().top,
            selfHeight  = self.$el.outerHeight(),

            $selfParent = self.$el.parent();

        if ( !self.$el.data('px-reverse') ) {
            ( scr >= selfTop && scr < $selfParent.offset().top + $selfParent.outerHeight()) && TweenMax.set(self.$el, {className: '+=is-active'});
        } else {
            ( (scr < $selfParent.offset().top + $selfParent.outerHeight()) && (scr + IG.$win.height() >= selfTop + selfHeight) ) && TweenMax.set(self.$el, {className: '+=is-active'});
        }

        if ( scr <= $selfParent.offset().top + $selfParent.outerHeight() && self.$el.offset().top + selfHeight >= $selfParent.offset().top + $selfParent.outerHeight() ) {
            TweenMax.set(self.$el, {className: '-=is-active'});
            TweenMax.set(self.$el, {className: '+=done-active'});
        }
    }
};

module.exports = Stickys;
