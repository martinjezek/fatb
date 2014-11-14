"use strict";

+function($) {
    /*!
     * FATB CLASS DEFINITION
     * =====================
     */
    var Fatb = function(element, options) {
        var self = this;
        self.options = options, self.$fatb = $(element), self.myMethod(self, self.$fatb.html(), function(param) {
            self.$fatb.html(param);
        });
    };
    Fatb.prototype.myMethod = function(obj, param, callback) {
        var self = _self(obj);
        return param = self.options.upperCase ? param.toUpperCase() : param.toLowerCase(), 
        "function" != typeof callback ? param : void callback(param);
    }, /*!
     * FATB DEFAULTS
     * =============
     */
    Fatb.DEFAULTS = {
        upperCase: !1
    };
    /*!
     * FATB PLUGIN DEFINITION
     * ======================
     */
    var old = $.fn.fatb;
    $.fn.fatb = function(option, optionExt, optionExt2) {
        return this.each(function() {
            var $this = $(this), data = $this.data("fatb");
            if (!data) {
                var options = $.extend(!0, {}, Fatb.DEFAULTS, option);
                $this.data("fatb", data = new Fatb(this, options));
            }
            "string" == typeof option && (void 0 !== optionExt2 ? data[option].call($this, data, optionExt, optionExt2) : void 0 !== optionExt ? data[option].call($this, data, optionExt) : data[option].call($this, data));
        });
    }, $.fn.fatb.Constructor = Fatb;
    /*!
     * FATB PLUGIN SELF GETTER
     * =======================
     */
    var _self = function(obj) {
        return void 0 !== obj ? void 0 !== obj.data ? void 0 !== obj.data.self ? obj.data.self : obj.data : obj : null;
    };
    /*!
     * FATB NO CONFLICT
     * ================
     */
    $.fn.fatb.noConflict = function() {
        return $.fn.fatb = old, this;
    };
}(jQuery);