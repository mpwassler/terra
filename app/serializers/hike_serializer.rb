class HikeSerializer
  def initialize(hike)
    @hike = hike
  end

  def to_json
    hike_data.to_json
  end

  def hike_data
    {
      distance: @hike.distance,
      vertical_gain: @hike.vertical_gain,
      path: hike_geojson
    }
  end

  def hike_geojson
    RGeo::GeoJSON.encode(@hike.recordings.first.path)
  end
end
