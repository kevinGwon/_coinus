/*!
 * ytiframe
 * change link to youtube player (iframe ver.)
 * @author: Alice Kim, alice@iropke.com
 */

import swfobject from 'swfobject';

(function($){

    let defaults = {
        videoWidth  : '100%',
        videoHeight : 'auto',
        videoIdBase : 'ytplayer',
        color       : 'white',
        autoplay    : 0,
        autofocus   : 1,
        controls    : 1,
        targetId    : '',
        theme       : 'dark',
        onReady     : undefined
    };

    $.fn.ytiframe = function(options){

        if (!this.length) {
            return this;
        }

        if (this.length > 1) {
            this.each(function(){ $(this).ytiframe(options); });
            return this;
        }

        let player = {},
            el = this,
            o = {};

        let regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;

        let init = function() {
            let match;

            $.extend(o, defaults, options);
            player.url = el.attr('href');
            player.videoId = '';
            player.ytId = '';

            match = player.url.match(regExp);

            if(!match) {
                console.log(`Youtube 영상에 지정된 url(${player.url})이 올바른 Youtube url 형식이 아닙니다.`);

                return false;
            }

            player.ytId = match[2];
            player.videoId = o.videoIdBase + player.ytId;

            if (!o.targetId) {
                if (el.parents('.flexible-obj').length > 0) {
                    player.container = el.wrap('<div class="video-player" />').parent();
                } else {
                    player.container = el.wrap('<div class="video-player flexible-obj" />').parent();
                }

                player.target = player.container;
            } else {
                $(`#${o.targetId}`).html('');
                player.target = $(`#${o.targetId}`);
            }

            if(Modernizr.video) {
                player.embed = $('<iframe src="//www.youtube.com/embed/'+ player.ytId +'?showinfo=0&color=' + o.color + '&theme=' + o.theme + '&enablejsapi=0&rel=0&autoplay='+ o.autoplay + '&controls=' + o.controls + '" frameborder="0" allowfullscreen></iframe>');
                player.embed
                    .appendTo(player.target);

                if (typeof o.onReady === 'function') o.onReady(player.embed);
            } else {
                let swfID = player.ytId + '_' + Math.random().toString(36).slice(2);

                player.target.append('<div id="' + swfID + '"></div>');

                swfobject.embedSWF(
                    'http://www.youtube.com/v/' + player.ytId + '?version=3&enablejsapi=1&autoplay=' + o.autoplay,
                    swfID,
                    '100%',
                    '100%',
                    '8',
                    null,
                    null,
                    { wmode: 'transparent' },
                    null,
                    typeof o.onReady === 'function' ? o.onReady : null
                );

                player.embed = player.target.find('object embed').eq(0);
            }

            player.embed.attr('id', player.videoId);

            if (o.autoplay && o.autofocus) {
                player.embed.focus();
            }

            if(!o.targetId) {
                player.embed.addClass('video-iframe');
            }

            if (o.targetId == '') {
                el.hide();
            }
        };

        init();

        el.destroyPlayer = function() {
            if ( player.embed ) {
                player.embed.remove();
                el.css('display', '');
                el.unwrap();
            }
        };

        return this;
    };

})(jQuery);
