# MacroCC

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

[MIT](https://mit-license.org/)