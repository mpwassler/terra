class GpxParser
  class GpxParseError < StandardError
    def message
      "GPX file could not be parsed"
    end
  end

  def initialize(file_object, export_class)
    @xml_contents = file_object.read
    @hash_data = Hash.from_xml(@xml_contents)
    @exporter = export_class
  end

  def parse
    track_segments = @hash_data["gpx"]["trk"]["trkseg"]
    track_points = []
    if track_segments.kind_of?(Array)
      track_points = track_segments.first["trkpt"]
    else
      track_points = track_segments["trkpt"]
    end

    @exporter.new(track_points).export
  rescue StandardError
    raise GpxParseError
  end
end
