import { useState, useMemo, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import useSWR from 'swr'
import Select from 'react-select'

import Error from '../components/Error'
import parseCSV from '../utils/SeriesData/parseCSV'
import parseLatestData from '../utils/LatestData/parseLatestData'
import { parseQuery, formatQuery } from '../utils/UrlQueryHelper'
import getKeyOptionsMap from '../utils/getKeyOptionsMap'
import keysToOptions, { optionsToKeys } from '../utils/keysToOptions'
import filterAndMergeData from '../utils/filterAndMergeData'

const isClient = process.browser

const Chart = dynamic(() => import('../components/Chart'), { ssr: false })


const confirmedAPI = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv'
const latestDataApi = 'https://services9.arcgis.com/N9p5hsImWXAccRNI/arcgis/rest/services/Z7biAeD8PAkqgmWhxG2A/FeatureServer/1/query?f=json&where=Confirmed%20%3E%200&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc%2CCountry_Region%20asc%2CProvince_State%20asc&resultOffset=0&resultRecordCount=250&cacheHint=true'

export default function Index() {
  const defaultKeys = useMemo(() => isClient ? parseQuery(location.search) : [], [isClient, parseQuery])
  const {
    data: confirmedCSVText,
    error: confirmedError
  } = useSWR(confirmedAPI, (k) => fetch(k).then(r => r.text()))

  const {
    data: latestDataRaw,
    error: latestDataError
  } = useSWR(latestDataApi, (k) => fetch(k).then(r => r.json()))

  const confirmedData = useMemo(() => confirmedCSVText && parseCSV(confirmedCSVText), [confirmedCSVText])
  const keyOptionsMap = useMemo(() => confirmedData && getKeyOptionsMap(confirmedData), [confirmedData])
  const options = useMemo(() => keyOptionsMap && Object.values(keyOptionsMap), [keyOptionsMap])

  const latestData = useMemo(() => latestDataRaw && parseLatestData(latestDataRaw), [latestDataRaw])
  console.log(latestData)

  const defaultOptions = useMemo(() => keyOptionsMap && defaultKeys && keysToOptions(defaultKeys, keyOptionsMap), [keyOptionsMap, defaultKeys])

  const [filterKeys, setFilterKeys] = useState(defaultKeys)
  const [chartData, setChartData] = useState([])

  const handleFilterKeyChange = useCallback((selectedOptions) => {
    const keys = optionsToKeys(selectedOptions || [])
    history.pushState(null, '', `?${formatQuery(keys)}`)
    setFilterKeys(keys)
  }, [])
  const normalizeFilterKeys = useCallback((keys) => {
    return keys.filter((k) => !!keyOptionsMap[k])
  }, [keyOptionsMap])

  useEffect(() => {
    if (!confirmedData || !latestData) { return }
    setChartData(filterAndMergeData(confirmedData, latestData, normalizeFilterKeys(filterKeys)))
  }, [filterKeys, confirmedData, latestData])

  // Error & Loading
  if (confirmedError || latestDataError) {
    return <Error error={confirmedError || latestDataError}/>
  }
  if (!confirmedCSVText) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Head>
        <title>COVID-19 Cases Chart</title>
      </Head>
      <h1>COVID-19 Cases Chart</h1>
      <div className="field">
        <label>Search by City, State(abbr.), or Country</label>
      </div>
      <Select
        placeholder="City, State(abbr.), or Country"
        defaultValue={defaultOptions}
        isMulti
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleFilterKeyChange}
      />
      <Chart data={chartData} />

      <footer>
        data source: <a target="_blank" href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">Johns Hopkins CSSE</a>
        <br/>
        source code: <a target="_blank" href="https://github.com/houkanshan/covid-19-vis">github</a>
      </footer>
    </div>
  )
}
