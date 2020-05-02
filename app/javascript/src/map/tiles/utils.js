const getTileMeters = (feature) => {
  let a = feature.geometry.coordinates[0][2][0]
  let b = feature.geometry.coordinates[0][0][0]
  return a - b
}

export default {
  getTileMeters
}
