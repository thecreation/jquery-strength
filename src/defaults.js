export default {
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
    score: 'strength-score',
    shown: 'strength-shown'
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
