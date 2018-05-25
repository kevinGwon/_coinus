import IG from 'module/global';
import Util from 'module/util';
import ScrollMagic from 'scrollmagic';
import 'slick-carousel';
import 'animation.gsap';
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators'; // for debug

class Main {
    constructor() {
        this.init();
    }
    init() {
        console.log('[on main.js]');
    }
}

$(function() {
    new Main();
});