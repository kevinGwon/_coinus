var IG = require('./global');

/**
 * change image with breakpoints
 * dependencies: jQuery, switchLayout(), getBgUrl($el)
 */

function responsiveImg() {
    if (!$('[data-rwd]').length) return;

    IG.DEV && console.log('[responsiveImg]');

    var ResponsiveImg = function() {
        $('[data-rwd]').each(function(i, el) {
            var $el = $(el),
                src, src_s;

            src = $el.data('rwd');
            src_s = ($el.is('img')) ? $el.attr('src') : getBgUrl($el);

            $el.data({
                'rwd': src,
                'rwd-m': src_s,
                'rwd-loaded': true
            });

            $el.attr('data-responsive', true);

            TweenMax.to($el, 0.5, {
                delay: 0.1,
                autoAlpha: 1,
                onComplete: function() {
                    // $el.removeAttr('data-rwd');
                }
            });
        });

        /**
         * get css background-image url from element
         * dependencies: jQuery
         */
        function getBgUrl($el) {
            var bg_url,
                bg_img = $el.css('background-image');

            // ^ Either "none" or url("...urlhere..")
            bg_url = /^url\((['"]?)(.*)\1\)$/.exec(bg_img);
            bg_url = bg_url ? bg_url[2] : ''; // If matched, retrieve url, otherwise ""

            return bg_url;
        }

        function changeImg(source) {
            var src = source || 'src';

            $('img[data-responsive]').attr('src', function() {
                return $(this).data(src);
            });

            $('div[data-responsive]').each(function(i, el) {
                var $el = $(el);
                $el.css('background-image', 'url(' + $el.data(src) + ')');
            });
        }

        IG.UI.switchLayout('rwdImg', function() {
            return IG.size >= IG.BP_MEDIUM;
        }, function(state) {
            var src = (state) ? 'rwd' : 'rwd-m';
            changeImg(src);
        });
    };

    return ResponsiveImg();
}

module.exports = $(function() {
    responsiveImg();
});
