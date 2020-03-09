export default function getKeyOptionsMap(data) {
  const cityStateCountry = {}
  data.forEach(({ city, state, cityState, country }) => {
    if (city) {
      cityStateCountry[city] = { value: city, label: cityState }
    }
    if (state) {
      cityStateCountry[state] = { value: state, label: state }
    }
    if (country) {
      cityStateCountry[country] = { value: country, label: country }
    }
  })
  return cityStateCountry
}