/**
* jQuery strength v0.2.0
* https://github.com/amazingSurge/jquery-strength
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
import $ from 'jquery';
import PasswordStrength from 'password_strength';

var DEFAULTS = {
  namespace: 'strength',
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

const NAMESPACE$1 = 'strength';

/**
 * Plugin constructor
 **/
class Strength {
  constructor(element, options) {
    this.element = element;
    this.$element = $(element);

    this.options = $.extend({}, DEFAULTS, options, this.$element.data());

    this.classes = this.options.classes;

    this.$username = $(this.options.usernameField);

    this.score = 0;
    this.status = null;

    this.trigger('init');
    this.init();
  }

  init() {
    this.createHtml();

    this.$element.addClass(this.classes.input);

    this.$toggle = this.$container.find(`.${this.classes.toggle}`);
    this.$meter = this.$container.find(`.${this.classes.meter}`);

    this.$score = this.$container.find(`.${this.classes.score}`);
    this.$input = this.$container.find(`.${this.classes.input}`);

    this.bindEvents();

    this.initialized = true;
    this.trigger('ready');
  }

  bindEvents() {
    this.$toggle.on('change', () => {
      this.toggle();
    });

    this.$input.bind('keyup.strength keydown.strength', () => {
      this.check();
    });

    this.$element.on('strength::check', (e, api, score, status) => {
      this.$score.html(this.options.scoreLables[status]);

      if (status !== this.status) {
        const newClass = this.options.scoreClasses[status];
        const oldClass = this.options.scoreClasses[this.status];
        this.$score.removeClass(oldClass).addClass(newClass);

        this.trigger('statusChange', status, this.status);
      }

      this.status = status;
      this.score = score;
    });

    this.$element.on('strength::statusChange', (e, api, current, old) => {
      this.$container.removeClass(this.getStatusClass(old)).addClass(this.getStatusClass(current));
    });
  }

  getStatusClass(status) {
    return this.options.classes.status.replace('{status}', status);
  }

  createHtml() {
    let output = this.options.templates.main;

    output = output.replace('{containerClass}', this.classes.container);
    output = output.replace('{toggle}', this.generateToggle());
    output = output.replace('{meter}', this.generateMeter());
    output = output.replace('{score}', this.generateScore());
    output = output.replace('{input}', `<div class="${this.classes.input}"></div>`);
    this.$container = $(output);

    if (this.options.skin) {
      this.$container.addClass(this.options.skin);
    }

    this.$element.before(this.$container);
    const $holder = this.$container.find(`.${this.classes.input}`);
    const el = this.$element.detach();
    $holder.before(el);
    $holder.remove();
  }

  generateToggle() {
    if (this.options.showToggle) {
      let output = this.options.templates.toggle;

      output = output.replace('{toggleClass}', this.classes.toggle);
      return output;
    }
    return '';
  }

  generateMeter() {
    if (this.options.showMeter) {
      let output = this.options.templates.meter;

      output = output.replace('{meterClass}', this.classes.meter);
      return output;
    }
    return '';
  }

  generateScore() {
    let output = this.options.templates.score;

    output = output.replace('{scoreClass}', this.classes.score);
    return output;
  }

  check() {
    let score = 0;
    let status = null;

    if ($.isFunction(this.options.scoreCallback)) {
      score = this.options.scoreCallback.call(this);

      if ($.isFunction(this.options.statusCallback)) {
        status = this.options.statusCallback.call(this, score);
      }
    } else {
      const check = new PasswordStrength();
      check.username = this.$username.val() || null;
      check.password = this.$input.val();

      score = check.test();
      status = check.status;
    }

    if (this.options.emptyStatus && status !== 'invalid' && this.$input.val() === '') {
      status = 'empty';
    }

    this.trigger('check', score, status);
  }

  getScore() {
    if (!this.score) {
      this.check();
    }
    return this.score;
  }

  getStatus() {
    if (!this.status) {
      this.check();
    }
    return this.status;
  }

  toggle() {
    const type = this.$toggle.is(":checked") ? "text" : "password";

    this.$input.attr('type', type);

    this.trigger('toggle', type);
  }

  trigger(eventType, ...args) {
    const data = [this].concat(args);

    // event
    this.$element.trigger(`${NAMESPACE$1}::${eventType}`, data);

    // callback
    eventType = eventType.replace(/\b\w+\b/g, word => word.substring(0, 1).toUpperCase() + word.substring(1));
    const onFunction = `on${eventType}`;
    if (typeof this.options[onFunction] === 'function') {
      this.options[onFunction](args);
    }
  }

  destory() {
    this.$element.data(NAMESPACE$1, null);
    this.trigger('destory');
  }

  static setDefaults(options) {
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }
}

var info = {
  version:'0.2.0'
};

const NAMESPACE = 'strength';
const OtherStrength = $.fn.strength;

const jQueryStrength = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)/.test(method))) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAMESPACE)) {
      $(this).data(NAMESPACE, new Strength(this, options));
    }
  });
};

$.fn.strength = jQueryStrength;

$.strength = $.extend({
  setDefaults: Strength.setDefaults,
  noConflict: function() {
    $.fn.strength = OtherStrength;
    return jQueryStrength;
  }
}, info);