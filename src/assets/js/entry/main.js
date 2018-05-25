// import IG from 'module/global';
// import Util from 'module/util';
// import ScrollMagic from 'scrollmagic';
// import 'slick-carousel';
// import 'animation.gsap';
// import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators'; // for debug

import Chartist from 'chartist';

class Main {
    constructor() {
        this.init();
    }
    init() {
        let $chart = $('.ct-chart'),
            $chartist = null,
            border = $chart.data('border'),
            value = $chart.data('value'),
            total = $chart.data('total'),
            average = ((value / total) * 100).toFixed(0);

        // 100% 초과할 경우
        average < 100 ? average : average = 100;

        $chart.append('<div class="ct-average"><span class="ct-average-cell">Total<b>'+average+'%</b></span></div>');

        $chartist = new Chartist.Pie('.ct-chart', {
            series: [total, total, value]
        }, {
            donut: true,
            showLabel: false,
            donutWidth: border,
            total: total,
        });

        $chartist.on('draw', function(data) {
            if(data.type === 'slice') {
                var pathLength = data.element._node.getTotalLength();

                data.element.attr({
                    'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
                });

                var animationDefinition = {
                    'stroke-dashoffset': {
                        id: 'anim' + data.index,
                        dur: 700,
                        from: -pathLength + 'px',
                        to:  '0px',
                        easing: Chartist.Svg.Easing.easeOutQuint,
                        fill: 'freeze'
                    }
                };

                if(data.index !== 0) {
                    animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
                }

                data.element.attr({
                    'stroke-dashoffset': -pathLength + 'px'
                });

                data.element.animate(animationDefinition, false);
            }
        });

    }
}

$(function() {
    new Main();
});