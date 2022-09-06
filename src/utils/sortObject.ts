export function sortObject(obj: Record<string, string | number | boolean>) {
  return Object.keys(obj)
    .sort()
    .reduce(function (sorted, key) {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+")
      return sorted
    }, {})
}
