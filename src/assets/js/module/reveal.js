/**
 * inviewAnimation function
 * dependencies: inview event (inveiw.js)
 * @author: sherlock@iropke.com
 * last updat: 2017.01.25
 */

require('./global');
require('./inview');

$.fn.reveal = function(options) {
    var self = this,
        target;

    var defaults = $.extend(true, {
        play: null, // random || stagger
        offset: 0.7,
        duration: 1,
        column: 5,
        from: {
            autoAlpha: 0
        },
        to: {
            autoAlpha: 1,
            ease: Sine.easeOut,
            delay: 0.2
        }
    }, options);

    target = (defaults.play === 'stagger') ? self.children() : self;

    TweenMax.set(target, defaults.from);

    return target.each(function(i, elems) {
        var el = elems,
            stagger, random;

        $(el).one('inview', {
            offset: defaults.offset
        }, function() {
            stagger = (i * 0.2) % (defaults.column * 0.2);
            random = Math.random() * 0.3 + i * 0.05;

            defaults.to.delay =
                (defaults.play === 'random') ? random :
                (defaults.play === 'stagger') ? stagger : 0;

            TweenMax.to(el, defaults.duration, defaults.to);
        });
    });
};
