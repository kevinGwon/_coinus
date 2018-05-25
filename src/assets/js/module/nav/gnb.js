import IG from 'module/global';
import Util from 'module/util';
import 'lib/jquery.menu-aim';
import 'module/accordion';

class GNB {
    constructor() {
        this.re = /\/?\w*(\-)?\w*/g;

        this.active = 'is-active';

        this.DUR = 0.4;
        this.index = 0;

        this.isCompact = false;
        this.isOpen = false;
        this.isOpenNav = false;
        this.isOpenMenu = false;
    }
    init() {
        let self = this;

        this.$logo = IG.$header.find('.logo-a');
        this.$menu = $('.gnb-menu');
        this.$draw = this.$menu.find('.gnb-draw');

        this.$menuD1 = this.$menu.find('.d1');
        this.$menuD2 = this.$menu.find('.d2');
        this.$menuD3 = this.$menu.find('.d3');

        this.$curD1 = '';
        this.$curD2 = '';
        this.$curD3 = '';

        this.$curNav = '';

        this.$d1 = this.$menu.find('.gnb-d1');
        this.$d2 = this.$menu.find('.gnb-d2');
        this.$d3 = this.$menu.find('.gnb-d3');

        this.$close = this.$menu.find('.gnb-close');

        this.$search = $('.search-layer');
        this.$searchMenu = $('.common-menu--search');
        this.$searchClose = this.$search.find('.search-close');

        // for mobile
        this.$nav = $('.sidenav');
        this.$navD2 = this.$nav.find('.d2');
        this.$navD3 = this.$nav.find('.d3');

        this.$openNav = IG.$header.find('.open-sidenav');
        this.$closeNav = this.$nav.find('.close-sidenav');

        TweenMax.set(this.$draw, { clearProps: 'all' });

        this.setup();

        Util.switchedResize('GNB', function() {
            return IG.size >= IG.BP_LARGE;
        }, function(state) {
            if ( state ) {
                self.reset();
                self.closeNav();

                IG.$win.on('scroll', function() {
                    if ( IG.$main.is('.home') ) return;

                    (IG.scrollTop >= IG.$header.height()) ? self.compact() : self.expand();
                });
            }
        });

        this.setCur();
        this.setup();
        this.setNav();
        this.keyEventControl();
    }
    setup() {
        let self = this;

        IG.$body.on('click', function() {
            self.reset();
            self.closeNav();
        });
        this.$menu.menuAim({
            activate: (target) => {
                this.activate(target);
            },
            deactivate: (target) => {
                this.deactivate(target);
            },
            exit: () => {
                this.deactivate(this.$menuD1);
            },
            submenuDirection: 'below'
        });
    }
    setNav() {
        var self = this;

        self.$navD2.parent('li').addClass('has-sub');
        self.$navD3.parent('li').addClass('has-sub');

        self.$nav.on('click DOMMouseScroll mousewheel', function(e) {
            e.stopPropagation();
        });

        self.$openNav.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            self.openNav();
        });

        self.$closeNav.on('click', function() {
            self.closeNav();
        });

        $('.sidenav-menu').accordion({
            titleSelector:  'span.sidenav-d1',
            contSelector:   '.d2'
        });

        $('.sidenav-menu .d2').accordion({
            titleSelector:  'span.sidenav-d2',
            contSelector:   '.d3'
        });
    }
    activate(target) {
        let $target = $(target);
        // TweenMax.set( IG.$body, { className: '+=is-gnb-active'});
        // TweenMax.set( IG.$header, { className: '+=is-open'});

        $target.addClass('is-active');

        TweenMax.set($target.find('.gnb-sub-menu'), {
            'display': 'block',
            autoAlpha: 1,
            zIndex: 20
        });
    }
    activeCur() {
        this.$menu.find('.d1.is-current').addClass('is-active')
        .find('.gnb-d1').addClass('is-current');
        this.$menu.find('.d2.is-current').addClass('is-active')
        .find('.gnb-d2').addClass('is-current');
        this.$menu.find('.d3.is-current').addClass('is-active');

        if ( !IG.$body.hasClass('is-view') ) {
            this.$menu.find('.d1.is-current').find('.gnb-draw').addClass('is-active');
        }

        if ( this.$menuD1.filter('.is-current').length === 0 ) {
            this.$d1.addClass('is-on');
        } else {
            this.$d1.removeClass('is-on');
        }
    }
    deactivate(target) {
        let $target = $(target);

        $target.removeClass('is-active');

        TweenMax.set($target.find('.gnb-sub-menu'), {
            'display': 'none',
            autoAlpha: 0,
            zIndex: 1,
            onComplete: function() {
                TweenMax.set($target.find('.gnb-sub-menu'), {
                    clearProps: 'all'
                });
            }
        });
    }
    openNav() {
        var self = this,
            tl = new TimelineMax();

        TweenMax.set( IG.$body, { className: '+=is-nav-active'});

        TweenMax.to( $('#wrap'), self.DUR/2, {
            x: -(self.$nav.width()/2)
        });

        tl
        .fromTo(self.$nav, self.DUR, {
            x: '100%'
        }, {
            x: -self.$nav.width(),
            className: '+=is-active'
        });

        self.isOpenNav = true;
    }
    closeNav() {
        var self = this;

        if ( !self.isOpenNav ) return;

        TweenMax.set( IG.$body, { className: '-=is-nav-active'});
        TweenMax.to( self.$nav, self.DUR/2, {
            x: '100%',
            className: '-=is-active',
            onComplete: function() {
                TweenMax.set( self.$nav, { x: 0, clearProps: 'all' });
            }
        });

        TweenMax.set( $('#wrap'), { x: 0, clearProps: 'all' });

        self.isOpenNav = false;
    }
    keyEventControl() {
        var self = this;

        self.$focusItems = self.$menu.find('a');
        self.$focusLast = self.$focusItems.last();
        self.$focusOut = self.$focusItems.last();

        self.$logo.on('focus', function(){
            self.reset();
        });

        self.$focusItems.on('keydown', function(e){
            var $this = $(this);

            if ( e.keyCode === 37 ) {
                $this.parent('li').prev().find('> a').focus();
            } else if ( e.keyCode === 39 ) {
                $this.parent('li').next().find('> a').focus();
            }
        });

        self.$focusLast.on('blur', function() {
            self.reset();
        });

        self.$search.find('a, button').last().on('keydown', function(e) {
            if ( e.keyCode === 9 ) {
                IG.$body.click();
                self.$searchMenu.focus();
            }
        });
    }
    reset() {
        TweenMax.set( IG.$body, { className: '-=is-gnb-active' });
        TweenMax.set( IG.$header, { className: '-=is-open' });

        this.$menuD1.removeClass('is-active');
        this.$menuD2.removeClass('is-active');
        this.$menuD3.removeClass('is-active');

        this.$d1.removeClass('is-active');
        this.$d2.removeClass('is-active');
        this.$d3.removeClass('is-active');

        TweenMax.set(this.$draw, {
            clearProps: 'all'
        });

        this.activeCur();
    }

    setCur() {
        let self = this;

        if (!self.origin) {
            self.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }

        // http(https) 프로토콜 삭제
        self.origin = self.origin.split('//')[1];

        // get location
        self.href = (window.location.href)
        .replace(self.origin, '')
        .replace('#' + window.location.hash, '')
        .replace(window.location.search, '').split('//')[1];


        self.rootURL = self.$logo.attr('href').replace('.html', '');

        // 스트링 포맷 통일을 위해 주소의 마지막 / 문자 제거
        if ( self.href !== '/' && self.href.lastIndexOf('/') === (self.href.length - 1) ) {
            self.href = self.href.slice(0, -1);
        }

        // logo 주소가 절대 주소일때 처리
        if ( self.rootURL === self.origin + self.href ) {
            self.rootURL = self.rootURL.replace(self.origin, '');
        }

        // http(https) self.rootURL에서 프로토콜 삭제
        if ( self.rootURL.split('//')[1] !== undefined ) {
            self.rootURL = self.rootURL.split('//')[1];
        }

        self.rootPATH = self.rootURL.replace(self.origin, '');

        if ( self.href === '/' || self.href === self.rootURL) {
            self.$cur = 'home';
        } else {
            ( self.rootURL === '/' ) && (self.href = self.rootURL + self.href);

            self.href = self.href.replace( self.rootPATH, '');
            self.getURL = self.href.match(self.re)[0].replace('/', '');

            if ( self.$d1.filter('[href*="'+ self.getURL +'"]').length > 1 ) {
                self.getURL = self.href.match(self.re)[0] + self.href.match(self.re)[1];
            }

            self.$curD1 = self.$d1.filter('[href*="'+ self.getURL +'"]').parent().addClass('is-current');
            self.index = self.$curD1.index();

            // current sidenav
            if ( self.index >= 0 ) {
                self.$curNav = self.$nav.find('.d1').eq(self.index).addClass('is-active');
            }

            if ( self.$curD1.length ) {

                self.getURL = self.href.match(self.re)[0] + self.href.match(self.re)[1];

                // Activate 2depth
                if ( self.$curD1.find('.gnb-d1-a, .gnb-d2').filter('[href*="'+ self.getURL +'"]').length > 1 ) {

                    self.$curD2 = self.$curD1.find('.gnb-d1-a, .gnb-d2').filter('[href*="'+ self.getURL +'"]');

                    if ( self.href.match(self.re)[2] ) {
                        self.getURL = self.getURL + self.href.match(self.re)[2];

                        if ( self.href.match(self.re)[3] ) {
                            self.getURL = self.getURL + self.href.match(self.re)[3];
                        }

                        self.$curD3 = self.$curD1.find('.gnb-d3').filter('[href*="'+ self.getURL +'"]').parent('li');
                        self.$curD3.first().addClass('is-current');

                    } else {
                        self.$curD2.first().addClass('is-current');
                    }

                } else {
                    self.$curD2 = self.$curD1.find('.gnb-d2').filter('[href*="'+ self.getURL +'"]').parent().addClass('is-current');
                    self.$curD1.find('.gnb-d3').filter('[href*="'+ self.getURL +'"]').parent('li');

                    if ( self.href.match(self.re)[1] ) {

                        if ( self.href.match(self.re)[2] ) {
                            self.getURL = self.getURL + self.href.match(self.re)[2];

                            if ( self.href.match(self.re)[3] ) {
                                self.getURL = self.getURL + self.href.match(self.re)[3];
                            }
                        }

                        self.$curD3 = self.$curD1.find('.gnb-d3').filter('[href*="'+ self.getURL +'"]').parent('li');

                        if ( self.$curD1.find('.gnb-d2, .gnb-d3').filter('[href*="'+ self.getURL +'"]').length > 1 ) {

                            self.$curD2.removeClass('is-current');
                            self.$curD3.first().addClass('is-current');

                        } else {

                            self.$curD3.addClass('is-current');
                        }
                    }
                }

                // Activate sidenav
                self.$curNav.find('a').filter('[href*="'+ self.getURL +'"]').first().addClass('is-current').parents('li').addClass('is-active');
            }
        }
    }
}

export default GNB;