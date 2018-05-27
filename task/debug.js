import IG from 'module/global';

let gridCol = `
    <div class="col-s-2 col-1" style="height: 100%; padding-top: 0; padding-bottom: 0;">
        <div style="background: red; height: 100%"></div>
    </div>`,

    $grid = $(`
    <div id="__debug_grid__"
         style="position: fixed; display: none; left: 0; right: 0; top: 0; height: 100%; opacity: 0.1; pointer-events: none; z-index: 10000">
        <div class="l-wrap" style="height: 100%;">
            <div class="row" style="height: 100%; margin-top: 0; margin-bottom: 0;">
                ${strRepeat(gridCol, 12)}
            </div>
        </div>
    </div>`);

let $winSize = $('<div id="__debug_window_size__"></div>'),
    $winScroll = $('<div id="__debug_window_scroll__"></div>'),

    resizeTmr,
    scrollTmr,

    style = {
        display: 'none',
        position: 'fixed',
        bottom: 5,
        padding: '0 3px',
        fontSize: '12px',
        letterSpacing: '0',
        color: '#fff',
        fontFamily: 'Consolas, monospace',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 65535
    };

function strRepeat(str, count) {
    let output = '';

    for(let i=0; i<count; i++) {
        output += str;
    }

    return output;
}

function resize() {
    clearTimeout(resizeTmr);

    $winSize
        .stop()
        .css('opacity', 1).show()
        .text(`${IG.$win.width()}px × ${IG.$win.height()}px (${IG.bpNames[IG.size]}, ${IG.size})`);

    resizeTmr = setTimeout(function() {
        $winSize.fadeOut();
    }, 1500);
}

function scroll() {
    clearTimeout(scrollTmr);

    $winScroll
        .stop()
        .css('opacity', 1).show()
        .text(IG.$win.scrollTop());

    scrollTmr = setTimeout(function() {
        $winScroll.fadeOut();
    }, 500);
}

$winSize.css($.extend({}, style, {
    left: 5
}));

$winScroll.css($.extend({}, style, {
    right: 5
}));

$(function() {
    $winSize.appendTo('body');
    $winScroll.appendTo('body');
    $grid.appendTo('body');

    IG.$win.on('resize._debug', resize);

    IG.$win.on('scroll._debug', scroll);

    IG.$doc.on('keydown._debug', function(event) {
        if(event.key === 'F9') {
            $grid.toggle();
        }
    });

    resize();
    scroll();
});