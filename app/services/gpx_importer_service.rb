class GpxImporterService
  FORMAT = GisTypes::LineString

  def initialize(file_object, user)
    @file = file_object
    @hike = Hike.create user: user
    recording = Recording.create hike: @hike,
                                 path: parsed_file
    set_details_from_gpx recording
  rescue StandardError => error
    cleanup_faild_import
    raise error
  end

  def call
    @hike
  end

  private
    def set_details_from_gpx(recording)
      track_info = RecordingDecorator.new(recording)
      @hike.vertical_gain = track_info.elevation_change
      @hike.distance = track_info.length
    end

    def parsed_file
      GpxParser.new(@file, FORMAT).parse
    end

    def cleanup_faild_import
      @hike.destroy
    end
end
