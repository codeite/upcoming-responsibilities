const moment = require('moment')
const makeInterval = require('iso8601-repeating-interval')
const {toRange, toArray} = require('./number-range')

function getResponsibilitiesAfter (responsibilities, date, count) {
  date = moment(date)
  const soonDate = date.clone().add(7, 'days')

  const threeMonthsAgo = date.clone().add(-3, 'months')
  const sixMonthsHence = date.clone().add(6, 'months')

  const intervals = responsibilities.filter(x => x.schedule).map(x => {
    const interval = makeInterval(x.schedule)

    const firstAfter = interval.firstAfter(threeMonthsAgo)
    if (!firstAfter) {
      return null
    }

    return {
      id: x.id,
      name: x.name,
      complete: x.complete,
      interval,
      rIndex: firstAfter.index,
      date: firstAfter.date
    }
  }).filter(x => x !== null)

  const results = []

  while(results.length < count && intervals.length) {
    intervals.sort((a, b) => a.date > b.date ? 1 : -1)
    let nextEvent = intervals[0]
    if (nextEvent.date.isAfter(sixMonthsHence)) break;

    let comp = toArray(nextEvent.complete || '')
    let result = {
      name: nextEvent.name,
      date: nextEvent.date.format(),
      id: nextEvent.id + '_' + nextEvent.rIndex,
      done: comp.indexOf(nextEvent.rIndex) !== -1,
      overdue: nextEvent.date.isBefore(date),
      soon: nextEvent.date.isBefore(soonDate)
    }

    if (!result.done || !result.overdue) {
      results.push(result)
    }

    let nextDate
    do {
      nextDate = nextEvent.date.clone()
      nextDate.add(1, 'second')
      const firstAfter = nextEvent.interval.firstAfter(nextDate)

      if (firstAfter) {
        nextEvent.rIndex = firstAfter.index
        nextEvent.date = firstAfter.date.clone()
      } else {
        intervals.shift()
      }
    } while (!nextDate && intervals.length)
  }

  return results
}

function getResponsibilitiesAfterNow (responsibilities, count) {
  return getResponsibilitiesAfter(responsibilities, moment(), count)
}

module.exports = {
  getResponsibilitiesAfter,
  getResponsibilitiesAfterNow,
  toRange,
  toArray,
}

