/**
 * assignLang 함수
 * task 목록을 배열로 받아 각 요소에 언어 접미사를 추가한다.
 */

'use strict';

module.exports = (lang) => {
    /**
     * 접미사 추가
     * @param {Array} arr
     * @returns {*|Array|{}}
     */
    function assignLang(arr) {
        return arr.map(function(item) {
            if(Array.isArray(item)) {
                return assignLang(item);
            }

            return item + ':' + lang;
        });
    }

    return (arr) => {
        return assignLang(arr);
    };
};