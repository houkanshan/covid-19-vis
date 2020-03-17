import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import groupBy from 'lodash/groupBy'

export default function parseTestedData(data) {
  data = data.map((row, i) => {
    let prevTotal = 0
    let prevPositive = 0
    if (i !== 0) {
      const prevRow = data[i - 1]
      prevTotal = prevRow.total
      prevPositive = prevRow.positive
    }
    return {
      ...row,
      key: row.state + ' Daily Positive / Tested',
      count: Math.min((row.positive - prevPositive) / (row.total - prevTotal), 1),
      date: format(parseISO(row.dateChecked), 'yyyy-MM-dd'),
    }
  })
  return groupBy(data, 'state')
}