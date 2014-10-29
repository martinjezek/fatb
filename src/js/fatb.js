'use strict';

+function ($) {

    /*!
     * FATB CLASS DEFINITION
     * =====================
     */

    var Fatb = function (element, options) {
        var self = this;

        self.options = options;
        self.$fatb = $(element);

        self.myMethod(self, self.$fatb.html(), function(param) {
            self.$fatb.html(param);
        });
    };

    // Method /myMethod/
    // this is public myMethod only for demo showcase, change it to yours or add another one, callback is just for example of usage
    //
    Fatb.prototype.myMethod = function (obj, param, callback) {
        var self = _self(obj);

        if (self.options.upperCase) {
            param = param.toUpperCase();
        } else {
            param = param.toLowerCase();
        }

        if (typeof callback === 'function') {
            callback(param);
        } else {
            return param;
        }
    };

    /*!
     * FATB DEFAULTS
     * =============
     */

    Fatb.DEFAULTS = {
        upperCase: false
    };

    /*!
     * FATB PLUGIN DEFINITION
     * ======================
     */

    var old = $.fn.fatb;

    $.fn.fatb = function (option, optionExt, optionExt2) {
        return this.each(function () {
            var $this = $(this);
            var data  = $this.data('fatb');

            if (!data) {
                // extend default options
                var options = $.extend(true, {}, Fatb.DEFAULTS, option);
                $this.data('fatb', (data = new Fatb(this, options)));
            }
            if (typeof option == 'string') {
                if (optionExt2 !== undefined) {
                    data[option].call($this, data, optionExt, optionExt2);
                } else if (optionExt !== undefined) {
                    data[option].call($this, data, optionExt);
                } else {
                    data[option].call($this, data);
                }
            }
        });
    };

    $.fn.fatb.Constructor = Fatb;

    /*!
     * FATB PLUGIN SELF GETTER
     * =======================
     */

    var _self = function(obj) {
        if (obj !== undefined) {
            if (obj.data !== undefined) {
                if (obj.data.self !== undefined) {
                    return obj.data.self;
                } else {
                    return obj.data;
                }
            } else {
                return obj;
            }
        } else {
            return null;
        }
    };

    /*!
     * FATB NO CONFLICT
     * ================
     */

    $.fn.fatb.noConflict = function () {
        $.fn.fatb = old;
        return this;
    };

}(jQuery);
