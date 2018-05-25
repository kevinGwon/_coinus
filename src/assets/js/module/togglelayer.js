/**
* toggle layer
* @author: alice@iropke.com
* @releases: 2017.07.03
*/
var IG = require('../module/global');

var togglelayer = (function() {
    var defaults = {
        autoFocus: true,
        toggleByClass: false,
        activeClass: 'is-active',
        closeBtnClass: 'close-layer',
        onOpen: function() {},
        onClose: function() {}
    };

    $.fn.toggleLayer = function(options) {

        if(this.length == 0) return this;

        // support mutltiple elements
        if(this.length > 1){
            this.each(function() {$(this).toggleLayer(options);});
            return this;
        }

        // create a namespace to be used throughout the plugin
        var toggle = {},
            el = this;

        var init = function() {
            toggle.o = $.extend({}, defaults, options);
            toggle.targetId = el.attr('href');
            toggle.$target = $(toggle.targetId);
            toggle.$close = toggle.$target.find('.'+toggle.o.closeBtnClass);
            toggle.pos = el.offset();

            el.data('target', { isopen: false });

            if ( toggle.$target.is(':visible') ) {
                close();
            }

            el.on('click', function(event) {
                if ( el.data('target').isopen ) {
                    close();
                } else {
                    open();
                }
                event.stopPropagation();
                event.preventDefault();
            });

            toggle.$close.on('click', function(event) {
                close();
                el.focus();
                event.stopPropagation();
                event.preventDefault();
            });

            toggle.$target.on('click', function(event) {
                event.stopPropagation();
            });

            $('body').on('click.closeTarget', close);

            IG.$win.on('resize', function() {
                !Modernizr.touchevents && toggle.$target.is(':visible') && close();
            });

            setup();
        };

        var setup = function() {
            toggle.$target.attr({
                tabindex: '0'
            });
        };

        var close = function() {
            toggle.o.onClose(el, toggle.$target);
            toggle.o.toggleByClass || toggle.$target.hide();
            toggle.o.activeClass && toggle.$target.removeClass(toggle.o.activeClass);

            el.removeClass('toggle-on');
            el.data('target').isopen = false;
        };

        var open = function() {
            var $focus = toggle.$target;

            toggle.o.onOpen(el, toggle.$target);
            toggle.o.toggleByClass  || toggle.$target.show();
            toggle.o.activeClass    && toggle.$target.addClass(toggle.o.activeClass);

            if (toggle.$target.find('input').length && toggle.o.autoFocus) {
                $focus = toggle.$target.find('input').eq(0);
            }

            $focus.focus();
            el.addClass('toggle-on');
            el.data('target').isopen = true;
        };

        el.openTarget = open;
        el.closeTarget = close;

        init();

        return this;
    };
})();

module.exports = togglelayer;
