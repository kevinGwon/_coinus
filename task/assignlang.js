'use strict';

module.exports = (lang) => {
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