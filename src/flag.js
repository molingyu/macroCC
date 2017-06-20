/**
 * init flags.(e.g. arch/platform)
 * @param {Map} flag
 * @return {Map} 
 */
export default function initFlag(flag = new Map()) {
  if (this.window && this == this.window) {
    if (typeof process === 'object') {
      flag.set('ARCH', this.process.arch)
      flag.set('PLATFORM', this.process.platform)
      flag.set('NODE_VERSION', this.process.version)
      flag.set('MODULES_VERSION', this.process.versions.modules)
      flag.set('v8_VERSION', this.process.version)
      if (process.versions.nw != void 0) {
        // nwjs
        flag.set('ELECTRON', false)
        flag.set('NWJS', true)
        flag.set('NWJS_VERSION', this.process.versions.nw)
      } else if (process.versions.electron != void 0) {
        // electron
        flag.set('ELECTRON', true)
        flag.set('NWJS', false)
        flag.set('ELECTRON_VERSION', this.process.versions.electron)
      }
    } else {
      // web
      // flag.set('BROWSER', this.navigator.appName)
      // flag.set('BROWSER_VERSION', navigator.appVersion)
      flag.set('LANGUAGE', navigator.language)
    }
  } else {
    // nodejs
    flag.set('ARCH', this.process.arch)
    flag.set('PLATFORM', this.process.platform)
    flag.set('NODE_VERSION', this.process.version)
    flag.set('MODULES_VERSION', this.process.versions.modules)
    flag.set('v8_VERSION', this.process.version)
  }
  return flag
}