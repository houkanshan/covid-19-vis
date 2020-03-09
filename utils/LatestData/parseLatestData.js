import format from 'date-fns/format'

export default function parseLatestData(latestDataRaw) {
  return latestDataRaw.features.map(({ attributes }) => {
    const cityState = attributes.Province_State || ''
    const country = attributes.Country_Region
    const [state, city] = cityState.split(', ').reverse()
    return {
      state, city, country,
      data: [{
        date: format(Date.now(), 'yyyy-MM-dd'),
        count: attributes.Confirmed,
      }]
    }
  })
}