exports.$ = (id) => {
  return document.getElementById(id)
}

exports.formatDuration = (time) => {
  const m = '0' + Math.floor(time / 60)
  const s = '0' + Math.floor(time - m * 60)
  return m.substr(-2) + ':' + s.substr(-2)
}