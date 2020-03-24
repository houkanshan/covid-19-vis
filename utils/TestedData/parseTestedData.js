import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'

export default function parseTestedData(data) {
  const groupedData = groupBy(sortBy(data, 'date'), 'state')
  console.log(groupedData)
  for (let key in groupedData) {
    const stateData = groupedData[key]
    groupedData[key] = stateData.map((row, i) => {
      let prevTotal = 0
      let prevPositive = 0
      if (i !== 0) {
        const prevRow = stateData[i - 1]
        prevTotal = prevRow.total
        prevPositive = prevRow.positive
      }
      const dailyTotal = row.total - prevTotal
      const dailyPositive = row.positive - prevPositive
      return {
        ...row,
        key: row.state,
        dailyTotal, dailyPositive,
        dailyRate: Math.max(0, Math.min(dailyPositive / dailyTotal, 1)) || 1, // could be NaN
        totalRate: row.positive / row.total,
        date: format(parseISO(row.dateChecked), 'yyyy-MM-dd'),
      }
    })
  }
  return groupedData
}