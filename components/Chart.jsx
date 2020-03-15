import { useMemo } from 'react'

import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts'

export default function CountChart({ data, useRange, dateRanges }) {
  const mergedData = useMemo(() => {
    return data.reduce((acc, { key, data, defaultRange }) => {
      if (useRange) {
        const range = dateRanges[key] || defaultRange
        data = data.slice(range[0], range[1])
      }

      return acc.concat(data.map((d, index) => ({
        ...d,
        index,
      })))
    }, [])
  }, [data, dateRanges])

  const xKey = useRange ? 'index' : 'date'

  return (
    <div className="chart">
      <Chart height={400} data={mergedData} forceFit padding="auto">
        <Legend />
        <Axis name={xKey} />
        <Axis name="count" />
        <Tooltip
          crosshairs={{ type: "y" }}
        />
        <Geom
          type="line"
          position={[xKey, 'count'].join('*')}
          size={2}
          color={'key'}
        />
        <Geom
          type="point"
          position={[xKey, 'count'].join('*')}
          size={2}
          shape={'circle'}
          color={'key'}
          style={{
            stroke: '#fff',
            lineWidth: 1
          }}
        />
      </Chart>
    </div>
  )
}
