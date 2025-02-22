export function unCamelCase(str) {
  return (
    str
      // insert a space between lower & upper
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // space before last upper in a sequence followed by lower
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
      // uppercase the first character
      .replace(/^./, function (str) {
        return str.toUpperCase()
      })
      // Id -> ID,Sa -> SA
      .replace(/\b(Id|Sa|Bvn|Fi|Id)\b/, function (str) {
        return str.toUpperCase()
      })
  )
}

export function CamelCase(str) {
  str = str.toLowerCase() // ID->Id
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}
