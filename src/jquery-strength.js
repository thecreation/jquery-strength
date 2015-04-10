/*
 * jquery-strength
 * https://github.com/amazingSurge/jquery-strength
 *
 * Copyright (c) 2015 amazingSurge
 * Licensed under the MIT license.
 */
(function($, document, window, undefined) {
    "use strict";

    var pluginName = 'strength';

    var Plugin = $[pluginName] = function(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, Plugin.defaults, options, this.$element.data());

        this.classes = this.options.classes;

        this.$username = $(this.options.usernameField);

        this.score = 0;
        this.status = null;

        this.trigger('init');
        this.init();
    };

    Plugin.defaults = {
        skin: null,

        showMeter: true,
        showToggle: true,

        usernameField: '',

        templates: {
            toggle: '<span class="input-group-addon"><input type="checkbox" class="{toggleClass}" title="Show/Hide Password" /></span>',
            meter: '<div class="{meterClass}">{score}</div>',
            score: '<span class="label {scoreClass}"></span>',
            main: '<div class="{containerClass}"><div class="input-group">{input}{toggle}</div>{meter}</div>'
        },

        classes: {
            container: 'strength-container',
            status: 'strength-{status}',
            input: 'strength-input',
            toggle: 'strength-toggle',
            meter: 'strength-meter',
            score: 'strength-score'
        },

        scoreLables: {
            empty: 'Empty',
            invalid: 'Invalid',
            weak: 'Weak',
            good: 'Good',
            strong: 'Strong'
        },

        scoreClasses: {
            empty: '',
            invalid: 'label-danger',
            weak: 'label-warning',
            good: 'label-info',
            strong: 'label-success'
        },

        emptyStatus: true,

        scoreCallback: null,
        statusCallback: null
    };

    Plugin.prototype = {
        constructor: Plugin,
        init: function() {
            this.createHtml();

            this.$element.addClass(this.classes.input);

            this.$toggle = this.$container.find('.' + this.classes.toggle);
            this.$meter = this.$container.find('.' + this.classes.meter);

            this.$score = this.$container.find('.' + this.classes.score);
            this.$input = this.$container.find('.' + this.classes.input);

            this.bindEvents();

            this.initialized = true;
            this.trigger('ready');
        },
        bindEvents: function() {
            var self = this;

            this.$toggle.on('change', function() {
                self.toggle();
            });

            this.$input.bind('keyup.strength keydown.strength', function() {
                self.check();
            });

            this.$element.on('strength::check', function(e, api, score, status) {
                self.$score.html(self.options.scoreLables[status]);

                if (status !== self.status) {
                    var newClass = self.options.scoreClasses[status],
                        oldClass = self.options.scoreClasses[self.status];
                    self.$score.removeClass(oldClass).addClass(newClass);

                    self.trigger('statusChange', status, self.status);
                }

                self.status = status;
                self.score = score;
            });

            this.$element.on('strength::statusChange', function(e, api, current, old) {
                self.$container.removeClass(self.getStatusClass(old)).addClass(self.getStatusClass(current));
            });
        },

        getStatusClass: function(status) {
            return this.options.classes.status.replace('{status}', status);
        },
        createHtml: function() {
            var output = this.options.templates.main;

            output = output.replace('{containerClass}', this.classes.container);
            output = output.replace('{toggle}', this.generateToggle());
            output = output.replace('{meter}', this.generateMeter());
            output = output.replace('{score}', this.generateScore());
            output = output.replace('{input}', '<div class="' + this.classes.input + '"></div>');
            this.$container = $(output);

            if (this.options.skin) {
                this.$container.addClass(this.options.skin);
            }

            this.$element.before(this.$container);
            var $holder = this.$container.find('.' + this.classes.input);
            var el = this.$element.detach();
            $holder.before(el);
            $holder.remove();
        },

        generateToggle: function() {
            if (this.options.showToggle) {
                var output = this.options.templates.toggle;

                output = output.replace('{toggleClass}', this.classes.toggle);
                return output;
            } else {
                return '';
            }
        },

        generateMeter: function() {
            if (this.options.showMeter) {
                var output = this.options.templates.meter;

                output = output.replace('{meterClass}', this.classes.meter);
                return output;
            } else {
                return '';
            }
        },

        generateScore: function() {
            var output = this.options.templates.score;

            output = output.replace('{scoreClass}', this.classes.score);
            return output;
        },

        check: function() {
            var score = 0;
            var status = null;

            if ($.isFunction(this.options.scoreCallback)) {
                score = this.options.scoreCallback.call(this);

                if ($.isFunction(this.options.statusCallback)) {
                    status = this.options.statusCallback.call(this, score);
                }
            } else {
                var check = new PasswordStrength();
                check.username = this.$username.val() || null,
                    check.password = this.$input.val();

                score = check.test();
                status = check.status;
            }

            if (this.options.emptyStatus & status !== 'invalid' && this.$input.val() === '') {
                status = 'empty';
            }

            this.trigger('check', score, status);
        },

        getScore: function() {
            if (!this.score) {
                this.check();
            }
            return this.score;
        },

        getStatus: function() {
            if (!this.status) {
                this.check();
            }
            return this.status;
        },

        toggle: function() {
            var type = this.$toggle.is(":checked") ? "text" : "password";

            this.$input.attr('type', type);

            this.trigger('toggle', type);
        },

        trigger: function(eventType) {
            var method_arguments = Array.prototype.slice.call(arguments, 1),
                data = [this].concat(method_arguments);

            // event
            this.$element.trigger(pluginName + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },

        destory: function() {
            this.$element.data(pluginName, null);
            this.trigger('destory');
        }
    };

    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)/.test(method))) {
                var api = this.first().data(pluginName);
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, pluginName);
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, options));
                }
            });
        }
    };
})(jQuery, document, window);
