import parse from 'csv-parse/lib/sync'
import parseSeries from './parseSeries'
import stateNameMap from '../stateNameMap'

const cityCol = 0
const countryCol = 1
const dataCol = 4
const startDateISO = '2020-01-22'

export default function parseCSV(csvText) {
  const confirmedRecord = parse(csvText, {
    from_line: 2, skip_empty_lines: true
  })
  return confirmedRecord.map((row) => {
    const cityState = row[cityCol].trim()
    const [state, city] = cityState.split(', ').reverse()
    return {
      city,
      state: stateNameMap[state] || state,
      cityState,
      country: row[countryCol].trim(),
      data: parseSeries(row.slice(dataCol), startDateISO)
    }
  })
}