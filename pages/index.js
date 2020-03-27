import { useState, useMemo, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import useSWR from 'swr'
import Select from 'react-select'
import Checkbox from '@material-ui/core/Checkbox'

import DateSliders from '../components/DateSliders'
import Error from '../components/Error'
import parseCSV from '../utils/SeriesData/parseCSV'
import parseLatestData from '../utils/LatestData/parseLatestData'
import parseTestedData from '../utils/TestedData/parseTestedData'
import { parseQuery, formatQuery } from '../utils/UrlQueryHelper'
import getKeyOptionsMap from '../utils/getKeyOptionsMap'
import keysToOptions, { optionsToKeys } from '../utils/keysToOptions'
import filterAndMergeData from '../utils/filterAndMergeData'

const isClient = process.browser

const Chart = dynamic(() => import('../components/Chart'), { ssr: false })
const TestedChart = dynamic(() => import('../components/TestedChart'), { ssr: false })


const confirmedAPI = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/archived_data/archived_time_series/time_series_19-covid-Confirmed_archived_0325.csv'
const latestDataAPI = 'https://services9.arcgis.com/N9p5hsImWXAccRNI/arcgis/rest/services/Z7biAeD8PAkqgmWhxG2A/FeatureServer/1/query?f=json&where=Confirmed%20%3E%200&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc%2CCountry_Region%20asc%2CProvince_State%20asc&resultOffset=0&resultRecordCount=250&cacheHint=true'
const testedDataAPI = 'https://covidtracking.com/api/states/daily'

export default function Index() {
  const defaultKeys = useMemo(() => isClient ? parseQuery(location.search) : [], [isClient, parseQuery])
  const {
    data: confirmedCSVText,
    error: confirmedError
  } = useSWR(confirmedAPI, (k) => fetch(k).then(r => r.text()))

  const {
    data: latestDataRaw,
    error: latestDataError
  } = useSWR(latestDataAPI, (k) => fetch(k).then(r => r.json()), { loadingTimeout: 2000 })

  const {
    data: testedData,
    error: testedDataError,
  } = useSWR(testedDataAPI, (k) => fetch(k).then(r => r.json()).then(parseTestedData))

  const confirmedData = useMemo(() => confirmedCSVText && parseCSV(confirmedCSVText), [confirmedCSVText])
  const keyOptionsMap = useMemo(() => confirmedData && getKeyOptionsMap(confirmedData), [confirmedData])
  const options = useMemo(() => keyOptionsMap && Object.values(keyOptionsMap), [keyOptionsMap])

  const latestData = useMemo(() => {
    if (!latestDataRaw) return []
    if (!latestDataRaw.features) return [] // error happen, usually api timeout.
    return parseLatestData(latestDataRaw)
  }, [latestDataRaw])

  console.log('LatestData:', latestData)
  console.log('TestedData:', testedData)

  const defaultOptions = useMemo(() => keyOptionsMap && defaultKeys && keysToOptions(defaultKeys, keyOptionsMap), [keyOptionsMap, defaultKeys])

  const [filterKeys, setFilterKeys] = useState(defaultKeys)
  const [chartData, setChartData] = useState([])
  const [dateRanges, setDateRanges] = useState({})
  const [isAligning, setIsAligning] = useState(false)
  const [showTested, setShowTested] = useState(false)

  const handleFilterKeyChange = useCallback((selectedOptions) => {
    const keys = optionsToKeys(selectedOptions || [])
    history.pushState(null, '', `?${formatQuery(keys)}`)
    setFilterKeys(keys)
  }, [])
  const normalizeFilterKeys = useCallback((keys) => {
    return keys.filter((k) => !!keyOptionsMap[k])
  }, [keyOptionsMap])

  useEffect(() => {
    if (!confirmedData || !latestData || !testedData) { return }
    setChartData(filterAndMergeData(confirmedData, latestData, testedData, normalizeFilterKeys(filterKeys), showTested))
  }, [filterKeys, confirmedData, latestData, testedData])

  // Error & Loading
  if (confirmedError || latestDataError) {
    return <Error error={confirmedError || latestDataError}/>
  }
  if (!confirmedCSVText) {
    return <div>Loading...</div>
  }

  console.log('ChartData:', chartData)

  return (
    <div>
      <Head>
        <title>COVID-19 Cases Chart</title>
      </Head>
      <h1>COVID-19 Cases Chart</h1>
      <div className="field">
        <label>Search by City(stopped), State(abbr.), or Country</label>
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
      <Chart chartData={chartData} useRange={isAligning} dateRanges={dateRanges} />
      <div className="field">
        <label className="checkbox">
          <Checkbox
            checked={isAligning}
            onChange={(e) => setIsAligning(e.target.checked)}
            value="primary"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
          <span className="text">
            Custom date range
          </span>
        </label>
      </div>

      {isAligning && <DateSliders chartData={chartData} value={dateRanges} onChange={setDateRanges} />}

      <div className="field">
        <label className="checkbox">
          <Checkbox
            checked={showTested}
            onChange={(e) => setShowTested(e.target.checked)}
            value="primary"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
          <span className="text">
            Show positive per tested
          </span>
        </label>
      </div>
      {showTested && <TestedChart chartData={chartData} /> }

      <footer>
        data source:
        <a target="_blank" href="https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6">Johns Hopkins CSSE</a>
        ,&nbsp;
        <a target="_blank" href="https://covidtracking.com">The COVID Tracking Project</a>
        <br/>
        source code: <a target="_blank" href="https://github.com/houkanshan/covid-19-vis">github</a>
      </footer>
    </div>
  )
}
