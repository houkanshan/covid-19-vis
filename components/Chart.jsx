import { useMemo } from 'react'
import dynamic from 'next/dynamic'

import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts'

export default function CountChart({ data }) {
  const mergedData = useMemo(() => {
    return data.reduce((acc, v) => {
      return acc.concat(v.data)
    }, [])
  }, [data])
  return (
    <div className="chart">
      <Chart height={400} data={mergedData} forceFit>
        <Legend />
        <Axis name="date" />
        <Axis name="count" />
        <Tooltip
          crosshairs={{ type: "y" }}
        />
        <Geom
          type="line"
          position="date*count"
          size={2}
          color={'key'}
          shape={'smooth'}
        />
        <Geom
          type="point"
          position="date*count"
          size={4}
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
