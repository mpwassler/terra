class AnnotationCreator  
  def initialize(params)
    @params = params
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
      RGeo::GeoJSON.decode(geojson).geometry
    end
end
