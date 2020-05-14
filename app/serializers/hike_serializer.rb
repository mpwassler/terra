class HikeSerializer < Blueprinter::Base
  identifier :id
  fields :distance, :vertical_gain, :created_at, :name
  association :hike_annotations, blueprint: HikeAnnotationSerializer
  field :link do |hike|
    Rails.application.routes.url_helpers.hike_path(hike)
  end
  field :path do |hike|
    RGeo::GeoJSON.encode(hike.recordings.first.path)
  end

  field :cover_image do |hike|
    if hike.cover_image.attached?
      blob = hike.cover_image.blob
      variant = blob.variant resize: '450x200^',
                             extent: '450x200',
                             gravity: 'South'
      {
        path: Rails.application.routes.url_helpers.url_for(blob),
        thumbnail_path: Rails.application.routes.url_helpers.url_for(variant),
        metadata: blob.metadata
      }
    end
  end
end
