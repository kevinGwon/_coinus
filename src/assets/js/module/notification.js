/**
 * notification popup
 * dependencies: jQuery, gsap
 * @author: peter@iropke.com
 * @fork: diana@iropke.com
 * @lastUpdate: 2017.10.17
 */
var IG = require('../module/global');

function Notification(options) {
    var defaults = {
            id: 'notification',
            msg: '', // 메시지 내용
            type: 'close', // 메시지 타입 (close, confirm)
            timer: 3000, // 지연 시간
            onClose: function() {}
        },
        o = {},
        $preFocus = IG.$body.find(':focus'),
        $popup, $content, popupSize = {},
        btnHtml;

    $.extend(o, defaults, options);

    if (o.type === 'close') {
        btnHtml = '<button type="button" class="btn btn--sm notification-close"><span>닫기</span></button>';
    } else if (o.type === 'confirm') {
        btnHtml = '<button type="button" class="btn btn--sm"><span>확인</span></button>';
    }

    $popup = $('<div class="notification is-hide" tabindex="0" />');
    $content = $('<section class="notification-inner"><h1 class="a11y">Notification</h1><span class="notification-text">' + o.msg + '</span>' + btnHtml + '</section>');

    // popup settings
    $popup.appendTo('body').attr('id', o.id);
    $content.appendTo($popup);

    popupSize.height = parseInt($popup.height());

    // show popup
    $popup.css('visibility', 'visible').focus();
    TweenMax.fromTo($popup, 0.5, {
        autoAlpha: 0,
    }, {
        autoAlpha: 1,
        ease: Power2.easeOut
    });

    // close event / click or timeout
    $popup.on('click', close);

    if (o.type === 'close' && o.timer) {
        setTimeout(close, o.timer);
    }

    function close() {
        TweenMax.to($popup, 0.4, {
            autoAlpha: 0,
            ease: Power2.easeIn,
            onComplete: function() {
                $popup.remove();
                o.onClose();
            }
        });

        if ($('.has-error')) {
            $preFocus = $('.has-error').first().prev('input');
        }
        $preFocus.focus();
    }
}

module.exports = Notification;
window.notification = Notification;
