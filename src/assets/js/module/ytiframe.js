/*!
 * ytiframe
 * change link to youtube player (iframe ver.)
 * @author: Alice Kim, alice@iropke.com
 */

var ytiframe = (function(){
    var defaults = {
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

        if (this.length == 0) return this;

        if (this.length > 1) {
            this.each(function(){ $(this).ytiframe(options); });
            return this;
        }

        var player = {},
            el = this,
            o = {};

        var regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;

        var init = function() {
            $.extend(o, defaults, options);
            player.url = el.attr('href') ? el.attr('href') : el.data('yt-url');
            player.videoId = '';
            player.ytId = '';

            player.ytId = player.url.match(regExp)[2];
            player.videoId = o.videoIdBase + player.ytId;

            if (!o.targetId) {
                if (el.parents('.flexible-obj').length > 0) {
                    player.container = el.wrap('<div class="video-player" />').parent();
                } else {
                    player.container = el.wrap('<div class="video-player flexible-obj" />').parent();
                }

                player.target = player.container;
            } else {
                $('#' + o.targetId).html('');
                player.target = $('#' + o.targetId);
            }

            player.embed = $('<iframe src="//www.youtube.com/embed/'+ player.ytId +'?showinfo=0&color=' + o.color + '&theme=' + o.theme + '&enablejsapi=0&rel=0&vq=hd1080&autoplay='+ o.autoplay + '&controls=' + o.controls + '" frameborder="0" allowfullscreen></iframe>');
            player.embed
            .appendTo(player.target);

            if (typeof o.onReady === 'function') o.onReady(player.embed);

            if (o.autoplay && o.autofocus) {
                player.embed.focus();
            }

            player.embed.attr('id', player.videoId);

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
})();

module.exports = ytiframe;
