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
      <h3>Daily Positive / Tested Rate</h3>
      <Chart height={200} data={mergedData} forceFit padding="auto">
        <Legend />
        <Axis name={xKey} />
        <Axis name="dailyRate" />
        <Axis name="total" />
        <Tooltip
          crosshairs={{ type: "y" }}
        />
        <Geom
          type="line"
          position={[xKey, 'dailyRate'].join('*')}
          size={1}
          color={'key'}
          tooltip={[[xKey, 'dailyRate', 'dailyPositive', 'dailyTotal', 'key'].join('*'), (date, rate, positive, total, state) => {
            return {
              name: `${state} = ${rate.toFixed(3)}`,
              value: `Positive: ${positive}, Tested: ${total}`
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
          position={[xKey, 'dailyRate'].join('*')}
          size={1}
          shape={'circle'}
          color={'key'}
          style={{
            stroke: '#fff',
            lineWidth: 1
          }}
        />
      </Chart>

      <h3>Total Positive / Tested Rate</h3>
      <Chart height={200} data={mergedData} forceFit padding="auto">
        <Legend />
        <Axis name={xKey} />
        <Axis name="totalRate" />
        <Tooltip
          crosshairs={{ type: 'y' }}
        />
        <Geom
          type="line"
          position={[xKey, 'totalRate'].join('*')}
          size={1}
          color={'key'}
          tooltip={[[xKey, 'totalRate', 'positive', 'total', 'key'].join('*'), (date, rate, positive, total, state) => {
            return {
              name: `${state} = ${rate.toFixed(3)}`,
              value: `Positive: ${positive}, Tested: ${total}`
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
          position={[xKey, 'totalRate'].join('*')}
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
