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
const latestDataApi = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1/query?where=%28Confirmed+%3E+0%29&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=Confirmed+desc&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=0&resultRecordCount=1000&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token='

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

  console.log(chartData)

  return (
    <div>
      <Head>
        <title>COVID-19 Cases Chart</title>
      </Head>
      <h1>COVID-19 Cases Chart</h1>
      <div className="field">
        <label>Search by City, State, or Country</label>
      </div>
      <Select
        placeholder="City, State, or Country"
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
