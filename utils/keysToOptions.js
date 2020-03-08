export function keyToOption(key) {
  return {
    value: key,
    label: key,
  }
}

export default function keysToOptions(keys) {
  return keys.map(keyToOption)
}

export function optionsToKeys(options) {
  return options.map(({ value }) => value)
}