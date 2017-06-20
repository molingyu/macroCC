# MacroCC
[![Build Status](https://travis-ci.org/molingyu/macroCC.svg?branch=master)](https://travis-ci.org/molingyu/macroCC)
[![Coverage Status](https://coveralls.io/repos/github/molingyu/macroCC/badge.svg?branch=master)](https://coveralls.io/github/molingyu/macroCC?branch=master)
[![npm version](https://badge.fury.io/js/macro-cc.svg)](https://badge.fury.io/js/macro-cc)
[![Join the chat](https://badges.gitter.im/macro-cc.svg)](https://gitter.im/macro-cc)
[![Dependency Status](https://www.versioneye.com/user/projects/594880870fb24f0032ea1b44/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/594880870fb24f0032ea1b44)

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