// 时间戳
function computeDate(time) {
  var date = new Date()
  date.setTime(time)
  var y = date.getFullYear(),
      m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  var minute = date.getMinutes(),
    second = date.getSeconds()
  minute = minute < 10 ? ('0' + minute) : minute
  second = second < 10 ? ('0' + second) : second

  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

export {
  computeDate
}
