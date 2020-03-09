export function keyToOption(keyOptionsMap, key) {
  const option = keyOptionsMap[key]
  if (!option) {
    return null
  }
  return option
}

export default function keysToOptions(keys, keyOptionsMap) {
  return keys.map(keyToOption.bind(null, keyOptionsMap)).filter(o => !!o)
}

export function optionsToKeys(options) {
  return options.map(({ value }) => value)
}