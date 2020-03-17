import { useMemo } from 'react'

import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from 'bizcharts'

export default function TestedChart({ chartData }) {
  const mergedData = useMemo(() => {
    return chartData.reduce((acc, { testedData }) => {
      return testedData ? acc.concat(testedData) : acc
    }, [])
  }, [chartData])

  const xKey = 'date'

  return (
    <div className="chart">
      <Chart height={400} data={mergedData} forceFit padding="auto">
        <Legend />
        <Axis name={xKey} />
        <Axis name="count" />
        <Axis name="total" />
        <Tooltip
          crosshairs={{ type: "y" }}
        />
        <Geom
          type="line"
          position={[xKey, 'count'].join('*')}
          size={1}
          color={'key'}
          tooltip={[[xKey, 'count', 'positive', 'total', 'key'].join('*'), (date, rate, positive, total, state) => {
            return {
              name: `${state}: ${rate.toFixed(3)}`,
              value: `positive: ${positive}, tested: ${total}`
            }
          }]}
        />
        {/* <Geom
          type="area"
          position={[xKey, 'total'].join('*')}
          size={1}
          color={'key'}
          tooltip={false}
        /> */}
        <Geom
          type="point"
          position={[xKey, 'count'].join('*')}
          size={1}
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
