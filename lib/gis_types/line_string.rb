module GisTypes
  class LineString
    def initialize(point_data)
      @point_data = point_data
      @factory = RGeo::Geographic.spherical_factory has_z_coordinate: true,
                                                    srid: 4326
    end

    def export
      @factory.line_string points
    end

    private
      def points
        @point_data.map do |track_point|
          @factory.point track_point["lon"],
                         track_point["lat"],
                         track_point["ele"]
        end
      end
  end
end
