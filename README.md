# [jQuery strength](https://github.com/amazingSurge/jquery-strength) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> jQuery strength provides a toggle feature for password input fields that allows the user to view or asterisk the password. It also features a strength indicator to show how secure a users password is.

It base on Nando Vieira's [password_strength](https://github.com/fnando/password_strength) which validates the strength of a password according to several rules.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-strength.js
├── jquery-strength.es.js
├── jquery-strength.min.js
└── css/
    ├── strength.css
    └── strength.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-strength/master/dist/jquery-strength.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-strength/master/dist/jquery-strength.min.js) - minified

#### Install From Bower
```sh
bower install jquery-strength --save
```

#### Install From Npm
```sh
npm install jquery-strength --save
```

#### Install From Yarn
```sh
yarn add jquery-strength
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-strength.git
cd jquery-strength
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-strength` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/strength.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-strength.js"></script>
```

#### Required HTML structure

```html
<input type="password" class="password-input form-control" name="password" value="" />
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.example').strength(); 
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-strength/tree/master/examples).

## Options
`jquery-strength` can accept an options object to alter the way it behaves. You can see the default options by call `$.strength.setDefaults()`. The structure of an options object is as follows:

```
{
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
}
```

## Methods
Methods are called on strength instances through the strength method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().strength('destroy');

// or
var api = $().data('strength');
api.destroy();
```

#### getScore()
Get the password score.
```javascript
var score = $().strength('getScore');
```

#### getStatus()
Get the input status.
```javascript
var status = $().strength('getStatus');
```

#### toggle()
Toggle to show or hide the password.
```javascript
$().strength('toggle');
```


#### destroy()
Destroy the strength instance.
```javascript
$().strength('destroy');
```

## Events
`jquery-strength` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('strength::ready', function (e) {
  // on instance ready
});

```

Event        | Description
------------ | -----------
init         | Fires when the instance is setup for the first time.
ready        | Fires when the instance is ready for API use.
toggle       | Fired immediately when the `toggle` instance method has been called.
statusChange | Fires when the input status changed.
check        | Fired immediately when the `check` instance method has been called.
destroy      | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.strength.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-strength.js"></script>
<script>
  $.strength.noConflict();
  // Code that uses other plugin's "$().strength" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-strength` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-strength` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-strength/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-strength.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-strength/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-strength.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-strength
[license]: https://img.shields.io/npm/l/jquery-strength.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-strength.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-strength