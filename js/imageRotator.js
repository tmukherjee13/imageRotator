/*
 *  Project: imageRotator
 *  Description: Album Image Rotator
 *  Author: Tarun Mukherjee
 *  License: Apache License 2.0
 */
;
(function($, window, document, undefined) {

    var pluginName = 'imageRotator', intervalId, obj,
            defaults = {
        count: 0,
        selector: "",
        counter: 0,
        pause: 1000
    };

    function imageRotator(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    imageRotator.prototype = {
        init: function() {
            this.config = $.extend({}, this.defaults, this.options);
            this.create();
        },
        create: function() {
            that = this;
            $(this.element).children(that.config.selector).eq(0).addClass("current");
            $(this.element).hover(function() {
                that.config.count = $(this).children(that.config.selector).length;
                that.config.selector = $(this).children(that.config.selector);
                that.config.counter = 0;
                that.startTransit(that);
            }, function() {
                that.config.selector.eq(that.config.counter).removeClass("current");
                that.config.selector.eq(0).addClass("current");
                clearInterval(intervalId);
                $(this).imageRotator('destroy');
            });
        },
        startTransit: function($this) {
            intervalId = setInterval(function() {
                that.doTransit();
            }, that.config.pause);
        },
        doTransit: function() {
            this.config.selector.eq(this.config.counter).removeClass("current");
            if (++this.config.counter >= this.config.count) {
                this.config.counter = 0;
            }
            this.config.selector.eq(this.config.counter).addClass("current");
        }
    };

    $.fn[pluginName] = function(options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function() {
                if (!$.data(this, this.id + '_plugin_' + pluginName)) {
                    $.data(this, this.id + '_plugin_' + pluginName, new imageRotator(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;
            this.each(function() {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (instance instanceof imageRotator && typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });
            return returns !== undefined ? returns : this;
        }
    };
}(jQuery, window, document));