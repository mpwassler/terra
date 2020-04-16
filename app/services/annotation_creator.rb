class AnnotationCreator  
  def initialize(params)
    @params = params
    @decoder = RGeo::GeoJSON::Coder.new geo_factory: geo_facotry
  end

  def geo_facotry
    RGeo::Geographic.spherical_factory has_z_coordinate: true,
                                                  srid: 4326
  end

  def call
    HikeAnnotation.new.tap do |hike_annotation|
      hike_annotation.point   = parse_point @params[:geojson].to_json
      hike_annotation.copy    = @params[:copy]
      hike_annotation.hike_id = @params[:hike_id]
    end
  end

  private
    def parse_point geojson
      @decoder.decode(geojson).geometry
    end
end
