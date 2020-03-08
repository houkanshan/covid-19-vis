export default function filterAndMergeData(data, keys) {
  return keys.map((key) => {
    console.log(key)
    let mergedData
    data.forEach(row => {
      if ([row.city, row.state, row.country].includes(key)) {
        if (mergedData) {
          mergedData = mergedData.map((dateData, index) => ({
            ...dateData,
            count: dateData.count + row.data[index].count,
          }))
        } else {
          // add key to each date data
          mergedData = row.data.map(d => ({
            ...d,
            key,
          }))
        }
      }
    })

    return {
      key,
      data: mergedData,
    }
  })
}
