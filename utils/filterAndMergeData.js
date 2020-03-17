export default function filterAndMergeData(data, latestData, testedData, keys, showTested) {
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

    if (latestMergedData) {
      if (mergedData[mergedData.length - 1].date === latestMergedData[0].date) {
        mergedData.length = mergedData.length - 1
      }
      mergedData.push({
        ...latestMergedData[0],
        key,
      })
    } else {
      console.error('Latest data is failed to merge')
    }

    const trimmedMergedData = mergedData.filter((d) => d.count !== 0)

    return {
      key,
      data: trimmedMergedData,
      testedData: testedData[key],
      startDate: trimmedMergedData[0].date,
      defaultRange: [0, trimmedMergedData.length - 1]
    }
  })
}
