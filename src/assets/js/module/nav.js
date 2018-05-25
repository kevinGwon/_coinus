/**
 * Site Navigation
 */

// import IG from 'module/global';
// import Util from 'module/util';
// import Sidenav from 'module/nav/sidenav';
import GNB from 'module/nav/gnb';
// import Mark from 'module/nav/mark';

class Nav {
    constructor() {
        // 각 메뉴 클래스에서 객체 생성
        // this.mark = new Mark();
        this.gnb = new GNB();
        // this.sidenav = new Sidenav();
    }

    init() {
        // this.mark.init();
        this.gnb.init();
        // this.sidenav.init();
    }
}

export default Nav;