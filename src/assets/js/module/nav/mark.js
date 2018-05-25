import IG from 'module/global';

class Mark {
    constructor() {
        // transition
        this.DUR = 0.3;

        // state
        this.active = 'is-active';
    }
    init() {
        // Regex
        this.re = /\/?\w*(\-)?\w*/g;

        //selector
        this.$logo = IG.$header.find('.logo-a');
        this.$menu = IG.$header.find('.gnb-menu');

        this.$d1 = this.$menu.find('.gnb-d1');
        this.$d2 = this.$menu.find('.gnb-d2');
        this.$d3 = this.$menu.find('.gnb-d3');

        //selector mobile
        this.$nav = IG.$sidenav;
        this.$navD2 = IG.$sidenav.find('.d2');
        this.$navD3 = IG.$sidenav.find('.d3');

        this.$curD1 = '';
        this.$curD2 = '';
        this.$curD3 = '';

        this.$curNav = '';

        this.index = 0;

        // func
        this.setCur();
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

export default Mark;