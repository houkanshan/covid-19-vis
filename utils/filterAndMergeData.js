export default function filterAndMergeData(data, latestData, keys) {
  return keys.map((key) => {
    let mergedData
    data.forEach(row => {
      if ([row.city, row.state, row.country].includes(key)) {
        if (!mergedData) {
          // add key to each date data
          mergedData = row.data.map(d => ({
            ...d,
            key,
          }))
        } else {
          mergedData = mergedData.map((dateData, index) => ({
            ...dateData,
            count: dateData.count + row.data[index].count,
          }))
        }
      }
    })

    var latestMergedData
    latestData.forEach(row => {
      if ([row.city, row.state, row.country].includes(key)) {
        if (!latestMergedData) {
          // add key to each date data
          latestMergedData = row.data.map(d => ({
            ...d,
            key,
          }))
        } else {
          latestMergedData = latestMergedData.map((dateData, index) => ({
            ...dateData,
            count: dateData.count + row.data[index].count,
          }))
        }
      }
    })

    if (mergedData[mergedData.length - 1].date !== latestMergedData.date) {
      mergedData.push({
        ...latestMergedData[0],
        key,
      })
    }


    return {
      key,
      data: mergedData.filter((d) => d.count !== 0),
    }
  })
}
