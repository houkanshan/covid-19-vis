import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

export default function parseSeries(seriesData, startDateISO) {
  const startDate = parseISO(startDateISO)
  return seriesData.map((count, index) => (
    {
      date: format(addDays(startDate, index), 'yyyy-MM-dd'),
      // date: addDays(startDate, index),
      count: parseInt(count, 10),
    }
  ))
}