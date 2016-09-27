import $ from 'jquery';
import Strength from './strength';
import info from './info';

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
