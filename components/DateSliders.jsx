import Slider from '@material-ui/core/Slider'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

function DateSliders({ chartData, value, onChange }) {
  return chartData.map(({ key, data, defaultRange, startDate }) => {
    startDate = parseISO(startDate)
    return <div className="field" key={key}>
      <label>{key}</label>
      <Slider
        value={value[key] || defaultRange}
        step={1}
        min={0}
        max={data.length - 1}
        onChange={(e, range) => {
          onChange({
            ...value,
            [key]: range,
          })
        }}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => format(addDays(startDate, value), 'yyyy-MM-dd')}
      />
    </div>
  })
}

export default DateSliders