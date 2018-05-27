import IG from 'module/global';
import Chartist from 'chartist';
import 'module/dropdown';

class Coinus {
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
  <div lang="en" class="ct-total">${total}<span>${unit}</span></div>
  <div lang="en" class="ct-value">${value}<span>${unit}</span></div>
  <div lang="en" class="ct-average"><span class="ct-average-cell">Total<b>${average}%</b></span></div>
  `;

  this.$chartCircle.append(el);

  if (IG.isMobile && this.$chartCircle.data('m-border')) {
    border = this.$chartCircle.data('m-border');
  }

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
  this.$chartBar.each((i, el)=>{
    let $el = $(el),
    value = $el.data('value'),
    total = $el.data('total'),
    unit = $el.data('unit'),
    average = ((value/total)*100).toFixed(1);

    $el.append('<div lang="en" class="ct-value">'+value+unit+'<span lang="en" class="ct-average">'+average+'%</span></div>');

    let $value = $el.find('.ct-value');

    $value.css('width', average+'%');

    // color invert
    if(!IG.isMobile) {
      $value.outerWidth() < 10 ? $value.addClass('is-invert') : '';
    }
  });
}  
}

$(function() {
  new Coinus();
});
