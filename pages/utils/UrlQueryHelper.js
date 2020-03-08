export function parseQuery(query) {
  return query.slice(1).split('-').map(decodeURIComponent).filter(k => k)
}

export function formatQuery(keys) {
  return keys.join('-')
}