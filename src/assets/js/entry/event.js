class Event {
  constructor() {
    this.init();

    this.active = 'is-active';
  }
  init() {
    let self = this;

    this.$event = $('.event');
    this.$tab = this.$event.find('.event-tab');
    this.$list = this.$event.find('.event-list');

    // this.$tab.length && this.tab();
  }
  tab() {
    let self = this;
    
    this.$tab.find('a').on('click', function(e){
      let $this = $(this),
      $target = $('#'+$this.attr('href').slice(1));

      e.preventDefault();

      if($this.hasClass(self.active)) return false;

      self.$tab.find('a').removeClass(self.active);
      $this.addClass(self.active);
      self.$list.removeClass(self.active);
      $target.addClass(self.active);
    });
  }
}

$(function() {
  new Event();
});