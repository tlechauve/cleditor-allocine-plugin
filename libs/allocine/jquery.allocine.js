/*! jQuery Allocine API library - v0.0.1 - 2012-08-04
* https://github.com/tlechauve/AllocineJS
* Copyright (c) 2012 Thomas Lechauve; Licensed MIT, GPL */

(function (window, $) {
    'use strict';
    var partner = 'YW5kcm9pZC12M3M',
        build_url = function (url, params) {
            return url + '?' + $.param(params);
        },
        methods = {
            searchMovie: function (qparam, ajaxOptions) {
                return this.each(function () {
                    $(this).allocine('request', 'http://api.allocine.fr/rest/v3/search', {
                        q: qparam,
                        filter: 'movie',
                        count: 5
                    }, ajaxOptions);
                });
            },
            getMovie: function (id, ajaxOptions) {
                return this.each(function () {
                    $(this).allocine('request', 'http://api.allocine.fr/rest/v3/movie', {
                        code: id,
                        filter: 'movie',
                        profile: 'large'
                    }, ajaxOptions);
                });
            },
            request: function (url, params, ajaxOptions) {
                var $this = $(this),
                    queryparams = {
                        partner: partner,
                        format: 'json'
                    };
                return $.ajax($.extend({
                    url: build_url(url, $.extend(queryparams, params)),
                    context: $this
                }, ajaxOptions));
            }
        };
    $.fn.allocine = function (method) {
        var r;
        if (methods[method]) {
            r = methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            $.error('Method ' +  method + ' does not exist on jquery.allocine');
        }
        return r;
    };
}(window, jQuery));
