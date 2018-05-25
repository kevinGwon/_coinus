/**
* accordion list
* @author: alice@iropke.com
* @releases: 2017.07.10
*/

var $ = require('jquery');

var accordion = (function() {
    var defaults = {
        activeClass:   'is-active',
        titleSelector: '.q',
        contSelector:  '.a',
        collapsible:   false,
        callback:      function() {},
        onOpen:        function() {}
    };

    $.fn.accordion = function(opt) {

        if (this.length === 0) return this;

        if (this.length > 1) {
            this.each(function(){ $(this).accordion(opt); });
            return this;
        }

        var fold = {};
        var el = this;

        var init = function() {
            fold.o = $.extend({}, defaults, opt);
            fold.$el = $(el);
            fold.$q = el.find(fold.o.titleSelector);
            fold.$a = el.find(fold.o.contSelector);
            fold.$items = fold.$q.parent();
            fold.$cur = fold.$el.filter('.'+ fold.o.activeClass);

            fold.$q.css('cursor', 'pointer').attr('tabindex', 0);
            fold.$q.on('click.open keypress.open', function(event) {
                if ( event.type === 'click' || event.keyCode === 13 ) {
                    event.preventDefault();

                    open($(this).parent());
                }
            });

            fold.$cur.length && open(fold.$cur.eq(0));
            fold.$items.not('.'+fold.o.activeClass).find(fold.o.contSelector).hide();
        };

        var open = function($target) {
            var is_on = $target.hasClass(fold.o.activeClass);

            if (!fold.o.collapsible) {
                fold.$items.removeClass(fold.o.activeClass);
                fold.$a.stop(true, true).slideUp({
                    complete: function() {
                        fold.o.callback();
                        fold.$a.css('zoom', 1);
                    }
                });
            } else {
                $target.removeClass(fold.o.activeClass);
                $target.find(fold.o.contSelector).stop(true, true).slideUp({
                    complete: function() {
                        fold.o.callback();
                        fold.$a.css('zoom', 1);
                    }
                });
            }

            if (is_on) return;

            $target.addClass(fold.o.activeClass)
            .find(fold.o.contSelector)
            .stop(true, true).slideDown({
                complete: function() {
                    fold.o.callback();
                    fold.o.onOpen($target);
                }
            });
        };

        init();

        el.destroy = function() {
            fold.$items.removeClass(fold.o.activeClass);
            fold.$q.removeAttr('style tabindex');
            fold.$a.removeAttr('style');
            fold.$q.off('click.open keypress.open');
        };

        return this;
    };
})();

module.exports = accordion;
