/**
 * dropdown
 * @author: alice@iropke.com
 * @releases: 2017.09.20
 */
var IG = require('../module/global');

var Dropdown = (function() {
    var arrKey = [38, 40];

    function Dropdown() {
        this.$select = $('div.dropdown');
        this.$options = this.$select.find('.dropdown-option');

        this.setup();
    }

    Dropdown.prototype = {
        setup: function() {
            var self = this;

            self.$select.each(function() {
                var $box = $(this),
                    $selector = $box.find('.dropdown-selector'),
                    $selected = $box.find('.dropdown-text'),
                    $list = $box.find('.dropdown-option'),
                    $items,
                    selected = '',
                    islink = !!$list.find('a').length,
                    itemSelector = (islink) ? 'a' : 'li';

                function init() {
                    var top = 0;

                    $selector.attr('tabindex', 0);

                    setAttr();
                    self.setStyle($box);

                    self.$select.on('click.dropdown', function(e) {
                        // e.preventDefault();
                        e.stopPropagation();
                    });

                    // events
                    $list.on('click', itemSelector, function() {

                        if ( $(this).hasClass('is-disabled') ) {
                            $(this).blur();
                        } else {
                            select(this);
                        }
                    });

                    $list.on('keydown', itemSelector, function(e){
                        var item = this,
                            $li = self.getItem(itemSelector, item),
                            i = $(item).data('index');

                        switch (e.keyCode) {
                            // enter
                            case 13:
                                if(!islink) {
                                    !$li.hasClass('is-disabled') && $(item).trigger('click');

                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                                break;

                            // tab or esc
                            case 9:
                            case 27:
                                afterSelect();

                                e.preventDefault();
                                e.stopPropagation();
                                break;

                            // left or up
                            case 37:
                            case 38:
                                $li.prev().length && $items.eq(i - 1).focus();
                                break;

                            // right or down
                            case 39:
                            case 40:
                                $li.next().length && $items.eq(i + 1).focus();
                                break;
                        }
                    });

                    $list.on('focus', itemSelector, function() {
                        var item = this,
                            $li = self.getItem(itemSelector, item);
                        $li.addClass('is-active');
                    });

                    $list.on('blur', itemSelector, function() {
                        var item = this,
                            $li = self.getItem(itemSelector, item);
                        $li.removeClass('is-active');
                    });

                    $selector.on('click keydown', function(e) {
                        if (e.type === 'click' || e.keyCode == 13) {
                            if ( $box.data('is-open') ) {
                                self.close($box);
                            } else {
                                open();
                                if ( e.keyCode == 13 ) {
                                    $items.eq(0).focus();
                                }
                            }
                            e.preventDefault();
                        }
                    });

                    IG.$body.on('click', function() {
                        self.close($box);
                    });

                    // 선택된 아이템 처리
                    if ($list.has('.is-current').length || $list.find(':checked').length) {
                        if (islink) {
                            $list.find('.is-current').addClass('is-active');
                            $selected.text($list.find('.is-current').text());
                        } else {
                            top = $(window).scrollTop();
                            $list.find(':checked').parent().click();
                            $list.find('.is-current').click();
                            $(window).scrollTop(top);
                            $selector.blur();
                        }
                    }
                }

                function select(obj) {
                    var $el = $(obj),
                        has_el = !!$el.find('.select-item').length;

                    if ( has_el ) {
                        selected = $el.find('.select-item').html();
                    } else {
                        selected = $el.text();
                    }

                    $list.find('li').removeClass('is-current');
                    $el.parent('li').addClass('is-current');

                    $selector.find('>span').html( selected );

                    if ( !islink ) {
                        $list.find('input').prop('checked', false);
                        $items.removeClass('is-current');

                        $el.find('input').prop('checked', true).trigger('change');
                        $el.addClass('is-current');
                    }
                    afterSelect();
                }

                function setAttr() {
                    $items = ( islink ) ? $list.find('a') : $list.find('li');

                    $items.each(function(i, el) {
                        $(el).data('index', i);
                    });

                    if ( !islink ) {
                        $items.attr('tabindex', 0).find('input[type=radio]').attr('tabindex', '-1').each(function(idx, el) {
                            var $el = $(el), $label, id;

                            if ( $el.attr('id') && $el.attr('id') !== '' ) return;

                            id = $el.attr('name') + (idx + 1);
                            $el.attr('id', id);

                            $label = $el.parent('label') || $el.siblings('label');
                            $label.length && $label.attr('for', id);
                        });
                    }
                }

                function open() {
                    if ( $box.data('is-open') || self.isDisabled($box) ) return;

                    // li refresh 대비
                    setAttr();

                    self.open($box);
                }

                function afterSelect() {
                    self.close($box);
                    $selector.focus();
                }

                $(function() {
                    init();
                });
            });

            $(window).on('resize', function(){
                self.$select.each(function(i, el){
                    self.setStyle($(el));
                });
                self.allClose();
            });
        },
        getItem: function(itemSelector, el) {
            return (itemSelector === 'a') ? $(el).parent() : $(el);
        },
        open: function($box) {
            this.allClose();
            $box.addClass('is-active').css('zIndex', 80).data('is-open', true);
            $box.find('.dropdown-option').show();
            this.blockArrow();
        },
        close: function($box) {
            this.$options.hide();
            IG.$body.off('keydown.blockArrow');
            $box.removeClass('is-active').css('zIndex', '').data('is-open', false);
        },
        setStyle: function($box) {
            var $selector = $box.find('.dropdown-selector'),
                $list = $box.find('.dropdown-option'),
                islink = !!$list.find('a').length,
                $testItem = (islink) ? $list.find('a') : $list.find('label'),
                itemWidth, selectorWidth;

            // for resize
            $selector.width('');
            $list.show().css({'visibility':'hidden', 'width':''});

            if ( !$box.hasClass('dropdown--wide') ) {
                itemWidth = parseInt($testItem.width());
                selectorWidth = parseInt($selector.width());
                // boxWidth = parseInt($box.width());

                $selector.width(Math.max(itemWidth, selectorWidth));
            }

            $list.css({'visibility':'visible', 'width':'100%'}).hide();
        },
        allClose: function() {
            this.close(this.$select);
        },
        blockArrow: function() {
            IG.$body.on('keydown.blockArrow', 'li', function(event) {
                var key = event.which;

                if( $.inArray(key, arrKey) > -1 ) {
                    event.preventDefault();
                }
            });
        },
        isDisabled: function($box) {
            if ( $box.hasClass('is-disabled') && $box.data('disabled-msg') ) {
                alert($box.data('disabled-msg'));
            }
            return $box.hasClass('is-disabled');
        }
    };

    return Dropdown;
})();

module.exports = new Dropdown();
