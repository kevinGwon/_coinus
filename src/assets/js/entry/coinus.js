import IG from 'module/global';
import Chartist from 'chartist';
import 'module/dropdown';

class Coinus {
  constructor() {
    this.init();
  }
  init() {
    this.v = 0;
    this.total = 0;
    this.DUR = 0.7;

    this.$chartCircle = $('.ct-chart--circle');
    this.$chartBar = $('.ct-chart--bar');

    this.$chartBar.length && this.chartBar();
    this.$chartCircle.length && this.chartCircle();
  }
  chartBar() {
    this.$chartBar.each((i, el)=>{
      let $el = $(el),
          value = $el.data('value'),
          total = $el.data('total'),
          unit = $el.data('unit'),
          average = ((value/total)*100).toFixed(1);

          this.total += total;
          this.v += value;

      $el.append('<div lang="en" class="ct-value">'+value+unit+'<span lang="en" class="ct-average">'+average+'%</span></div>');

      let $value = $el.find('.ct-value');

      $value.css('width', average+'%');

      // color invert
      if(!IG.isMobile) {
        $value.outerWidth() < 10 ? $value.addClass('is-invert') : '';
      }
    });
  }
  chartCircle() {
    let self = this,
        value = this.v,
        total = this.total,
        unit = this.$chartCircle.data('unit'),
        average = ((value / total) * 100).toFixed(0),
        containerHeight = this.$chartCircle.parent().outerHeight(),
        count = {
          start: 0
        },
        el = null,
        $chartist = null;

    // 100% 초과할 경우
    average < 100 ? average : average = 100;

    el = `
    <div lang="en" class="ct-total">${total}<span>${unit}</span></div>
    <div lang="en" class="ct-value">${value}<span>${unit}</span></div>
    <div lang="en" class="ct-average"><span class="ct-average-cell">Total<b>${average}</b></span></div>
    `;

    this.$chartCircle.append(el);

    TweenMax.to(count, this.DUR, {
      start: average,
      onUpdate: function () {
        self.addNum($('.ct-average b'), count.start);
      }      
    });

    $chartist = new Chartist.Pie('.ct-chart--circle', {
      series: [total, total, value]
    }, {
      donut: true,
      showLabel: false,
      total: total
    });

    if(!IG.$html.hasClass('ie')) {
      setTimeout(()=>{
        let self = this,
            $el = $('.ct-chart-donut'),
            $path = $el.find('path');

        $path.each(function(i, el){
          let length = $(el).get(0).getTotalLength();

          TweenMax.set($(el), {
            strokeDasharray: length
          });

          TweenMax.fromTo($(el), self.DUR, {
            delay: 0.1,
            strokeDashoffset: length
          }, {
            strokeDashoffset: length * 2
          });            
        });
      }, 1);
    }   
  }  
  addNum($target, num) {
    num = Math.ceil(num);
    $target.html(Math.ceil(num)+'%');
  }   
}

$(function() {
  new Coinus();
});
