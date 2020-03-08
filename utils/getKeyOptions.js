export default function getKeyOptions(data) {
  const cityStateCountry = []
  data.forEach(({ city, state, country }) => {
    if (city) {
      cityStateCountry.push(city)
    }
    if (state && !cityStateCountry.includes(state)) {
      cityStateCountry.push(state)
    }
    if (country && !cityStateCountry.includes(country)) {
      cityStateCountry.push(country)
    }
  })
  return cityStateCountry
}