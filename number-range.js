function toRange(arr) {
  arr = arr.slice().map(x=>parseInt(x, 10))
  arr.sort((a,b) => a-b)

  const ranges = []

  while (arr.length) {
    let start, end
    start = end = arr.shift()

    while(arr.length && (arr[0] === end || arr[0] === end + 1)) {
      end = arr.shift()
    }

    if (end !== start) {
      ranges.push(start+'_'+end)
    } else {
      ranges.push(start)
    }
  }

  return ranges.join(',')
}

function toArray(str) {
  if (Array.isArray(str)) return str

  str = (str || '').trim()

  if (str.length === 0) return []

  const arr = []
  const ranges = str.split(',')
    .map(x => x.split('_').map(y=>y*1))

  ranges.forEach(r => {
    if (r.length === 1) {
      arr.push(r[0])
    } else {
      for(let i=r[0]; i<=r[1]; i++) {
        arr.push(i)
      }
    }
  })

  return arr
}

module.exports = {
  toRange, toArray
}