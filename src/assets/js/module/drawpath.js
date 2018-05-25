/*
* drawpath
* @author: sherlock@iropke.com
* @lastUpdate: 2017.08.22
*/


module.exports = (function() {
    var Drawpath = {};

    Drawpath = (function() {
        function Drawpath($element) {
            var self = this;

            self.$element = $element;
            self.$elementPath = $element.find('path');

            self.DUR = 0.6;

            self.init();
        }

        return Drawpath;
    })();

    Drawpath.prototype.init = function() {
        var self = this;

        self.draw();
    };

    Drawpath.prototype.draw = function() {
        var self = this;
        var tl = new TimelineMax();

        self.$elementPath.each(function(i, el) {
            var $el = $(el),
                elColor = self.$element.css('color'),
                elCanvas = self.$element[0].getBBox();

            var totalPath = elCanvas.width;

            TweenMax.set($el, {
                autoAlpha: 0,
                strokeDashoffset: totalPath,
                strokeDasharray: totalPath + ' ' + totalPath,
                attr: {
                    'stroke-dasharray': totalPath
                }
            });

            tl
            .fromTo($el, self.DUR*2, {
                autoAlpha: 1,
                stroke : 'transparent',
                strokeDashoffset: totalPath
            }, {
                stroke : elColor,
                strokeDashoffset: 0
            })
            .fromTo($el, self.DUR, {
                fill : 'transparent'
            }, {
                fill : elColor,
                ease: Sine.easeInOut,
                stroke: 'transparent'
            }, '-='+ self.DUR/2);
        });
    };

    $.fn.drawpath = function() {

        var _this = this;

        return _this.each(function() {
            _this.drawpath = new Drawpath(_this);
        });
    };
})();
