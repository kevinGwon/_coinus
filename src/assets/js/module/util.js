/**
 * UI 관련 함수
 */

export default {
    /**
    * 윈도우 리사이즈 이벤트 핸들러 추가, 즉시 실행
    */
    resize: function(callback) {
        let namespace;

        if(typeof callback === 'string') {
            namespace = callback;
            callback = arguments[1];
        }

        $(window).on('resize' + (namespace ? '.' + namespace : ''), callback);
        callback();
    },

    /**
    * 윈도우 스크롤 이벤트 핸들러 추가, 즉시 실행
    */
    scroll: function(callback) {
        let namespace;

        if(typeof callback === 'string') {
            namespace = callback;
            callback = arguments[1];
        }

        $(window).on('scroll' + (namespace ? '.' + namespace : ''), callback);
        callback();
    },

    /**
    * 윈도우 리사이징 시 특정 조건에 의해 함수 실행
    * @author: Peter Choi, peter@iropke.com
    * @param {String} namespace - resize 이벤트 namespace
    * @param {Function} cond - 조건을 판별할 함수
    * @param {Function} callback - resizing 중 조건이 변경되었을 때, 실행할 함수
    */
    switchedResize: function(namespace, cond, callback) {
        let state = cond(); // 현재 결과

        /**
        * resizing 중 조건 판단
        */
        function chkBreakpoint() {
            let result = cond();

            if(result !== state) {
                state = result;
                console.log('[switchLayout] layout switched.', namespace, state);
                callback(state);
            }
        }

        $(window).on('resize' + (namespace ? '.' + namespace : ''), function() {
            chkBreakpoint.call(null, state);
        });

        // 최초 실행
        callback(state);
    },

    /**
     * 다음 틱에 실행하기
     * 실행할 코드의 우선순위를 낮춤
     * @param {Function} func - 다음 틱에 실행할 함수
     */
    nextTick: function(func) {
        setTimeout(func, 0);
    },

    /**
     * 쿠키 설정하기
     * @param name
     * @param value
     * @param days
     */
    setCookie: function(name, value, days){
        let expire = new Date(),
            cookies;

        expire.setDate(expire.getDate() + days);
        cookies = name + '=' + encodeURI(value) + '; path=/ ';

        if(typeof days !== 'undefined') {
            cookies += ';expires=' + expire.toGMTString() + ';';
        }

        document.cookie = cookies;
    },

    /**
     * 쿠키값 가져오기
     * @param name
     * @returns {string}
     */
    getCookie: function(name) {
        let cookieData = document.cookie,
            start,
            value = '';

        name = name + '=';
        start = cookieData.indexOf(name);

        if(start !== -1) {
            let end;

            start += name.length;
            end = cookieData.indexOf(';', start);

            if(end === -1) {
                end = cookieData.length;
            }

            value = cookieData.substring(start, end);
        }

        return decodeURI(value);
    },
};