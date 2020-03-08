import { useState, useMemo, useCallback, useEffect, lazy } from 'react'
import dynamic from 'next/dynamic'

import useSWR from 'swr'
import Select from 'react-select'

import Error from '../components/Error'
import parseCSV from '../utils/parseCSV'
import { parseQuery, formatQuery } from '../utils/UrlQueryHelper'
import getKeyOptions from '../utils/getKeyOptions'
import keysToOptions, { optionsToKeys } from '../utils/keysToOptions'
import filterAndMergeData from '../utils/filterAndMergeData'

const isClient = process.browser

const Chart = dynamic(() => import('../components/Chart'), { ssr: false })


const confirmedAPI = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv'

export default function Index() {
  const defaultKeys = useMemo(() => isClient ? parseQuery(location.search) : [], [isClient, parseQuery])
  const {
    data: confirmedCSVText,
    error: confirmedError
  } = useSWR(confirmedAPI, (k) => fetch(k).then(r => r.text()))
  const [filterKeys, setFilterKeys] = useState(defaultKeys)
  const [chartData, setChartData] = useState([])

  const confirmedData = useMemo(() => confirmedCSVText && parseCSV(confirmedCSVText), [confirmedCSVText])
  const options = useMemo(() => confirmedData && keysToOptions(getKeyOptions(confirmedData)), [confirmedData])

  const handleFilterKeyChange = useCallback((selectedOptions) => {
    const keys = optionsToKeys(selectedOptions || [])
    history.pushState(null, '', `?${formatQuery(keys)}`)
    setFilterKeys(keys)
  }, [])

  useEffect(() => {
    if (!confirmedData) { return }
    setChartData(filterAndMergeData(confirmedData, filterKeys))
  }, [filterKeys, confirmedData])

  // Error & Loading
  if (confirmedError) {
    return <Error error={confirmedError}/>
  }
  if (!confirmedCSVText) {
    return <div>Loading...</div>
  }

  console.log(chartData)

  return (
    <div>
      <h1>COVID-19 Case Chart</h1>
      <Select
        placeholder="City, State, or Country"
        defaultValue={keysToOptions(filterKeys)}
        isMulti
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleFilterKeyChange}
      />
      <Chart data={chartData} />
      <footer>Data source: <a target="_blank" href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html">JHC</a></footer>
    </div>
  )
}