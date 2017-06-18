export default function error(type, msg, pos) {
  throw new type(`${msg}(${pos.file}:${pos.line}:${pos.index})`, pos)
}