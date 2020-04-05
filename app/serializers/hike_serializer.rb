class HikeSerializer < Blueprinter::Base
  identifier :id
  fields :distance, :vertical_gain, :created_at
  association :hike_annotations, blueprint: HikeAnnotationSerializer
  field :path do |hike|
      RGeo::GeoJSON.encode(hike.recordings.first.path)
  end
end