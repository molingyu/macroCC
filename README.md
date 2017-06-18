# MacroCC
[![Build Status](https://travis-ci.org/molingyu/macroCC.svg?branch=master)](https://travis-ci.org/molingyu/macroCC)
[![Coverage Status](https://img.shields.io/coveralls/gotwarlost/macroCC.svg)](https://coveralls.io/r/gotwarlost/macroCC?branch=master)

[![NPM](https://nodei.co/npm/macro-cc.png?downloads=true)](https://nodei.co/npm/macro-cc/)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fmolingyu%2FmacroCC.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fmolingyu%2FmacroCC?ref=badge_large)


A useful javascript Conditional Compilation macro.

# Example

```javascript
//#define a = 233
var a = /*# a */ / 2
//#if a > 100
console.log(100)
//#else
console.log(0)
//#end
console.log('hello macroCC!')
```

cc:
```javascript
var a = 233 / 2
console.log(100)
console.log('hello macroCC!')
```

# License

[MIT](/LICENSE)