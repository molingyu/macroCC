import chalk from 'chalk'

export default function error(type, msg, pos) {
  let error = `${type.name}: ${msg}(${pos.file}:${pos.lines}:${pos.cols})`
  let errorScript = getErrorScript(pos)
  console.log(error + '\n' + errorScript)
  process.exit(1)
}

function getErrorScript(pos) {
  let str = ''
  let codes = $macroCCScript.split('\n')
  let lines = [
    pos.lines - 2,
    pos.lines - 1,
    pos.lines,
    pos.lines + 1,
    pos.lines + 2
  ]
  let maxWidth = lines[4].toString().length
  lines.forEach((lineIndex) => {
    let code = codes[lineIndex-1]
    let width = lineIndex.toString().length
    let lineIndexStr = (maxWidth - width) > 0 ? Array().join(' ') + lineIndex : '' + lineIndex
    if(lineIndex == pos.lines) {
      str += chalk.red('> ') + chalk.gray(lineIndexStr+ ' | ') + `${code}\n`
      str += chalk.gray(Array(maxWidth + 3).join(' ') + ' | ') + Array(pos.cols).join(' ') + chalk.red('^\n')
    } else {
      if(code != void 0) str += `  ${chalk.gray(lineIndexStr + ' |')} ${code}\n`
    }
  })
  return str
}