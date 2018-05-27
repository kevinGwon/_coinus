import IG from 'module/global';
import Chartist from 'chartist';

class Chart {
  constructor() {
      this.init();
  }
  init() {
    this.$chartCircle = $('.ct-chart--circle');
    this.$chartBar = $('.ct-chart--bar');

    this.$chartCircle.length && this.chartCircle();
    this.$chartBar.length && this.chartBar();
  }
  chartCircle() {
    let border = this.$chartCircle.data('border'),
        value = this.$chartCircle.data('value'),
        total = this.$chartCircle.data('total'),
        unit = this.$chartCircle.data('unit'),
        average = ((value / total) * 100).toFixed(0),
        containerHeight = this.$chartCircle.parent().outerHeight(),
        el = null,

        $chartist = null;

    // 100% 초과할 경우
    average < 100 ? average : average = 100;

    el = `
        <div lang="en" class="ct-total">${total}${unit}</div>
        <div lang="en" class="ct-value">${value}${unit}</div>
        <div lang="en" class="ct-average"><span class="ct-average-cell">Total<b>${average}%</b></span></div>
    `;

    this.$chartCircle.append(el);

    $chartist = new Chartist.Pie('.ct-chart--circle', {
        series: [total, total, value]
    }, {
        donut: true,
        showLabel: false,
        donutWidth: border,
        total: total
    });

    if(!IG.$html.hasClass('ie')) {
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
  chartBar() {
    let self = this;

    this.$chartBar.each((i, el)=>{
      let $el = $(el),
        value = $el.data('value'),
        total = $el.data('total'),
        unit = $el.data('unit'),
        average = ((value/total)*100).toFixed(1);

      $el.append('<div lang="en" class="ct-value">'+value+unit+'<span lang="en" class="ct-average">'+average+'%</span></div>');

      let $average = $el.find('.ct-average'),
          $value = $el.find('.ct-value');

      // value < 2000 ? $value.addClass('is-invert') : '';
      
      $value.css('width', average+'%');

      setTimeout(()=>{
      },1000);
    });
  }
}

$(function() {
  new Chart();
});