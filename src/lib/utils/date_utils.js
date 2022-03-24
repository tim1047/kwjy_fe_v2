function strToYYYYMMDDHypen(val) {
  if (typeof val == 'string') {
    return (
      val.substring(0, 4) +
      '-' +
      val.substring(4, 6) +
      '-' +
      val.substring(6, 8)
    )
  }
}

function dateToYYYYMMDD(val) {
  var year = val.getFullYear()
  var month = ('0' + (1 + val.getMonth())).slice(-2)
  var day = ('0' + val.getDate()).slice(-2)
  return year + month + day
}

function YYYYMMDDToDate(val) {
  var y = val.substring(0, 4)
  var m = val.substring(4, 6)
  var d = val.substring(6, 8)
  return new Date(y, m - 1, d)
}

export { strToYYYYMMDDHypen, dateToYYYYMMDD, YYYYMMDDToDate }
