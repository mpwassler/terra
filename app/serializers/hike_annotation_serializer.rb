class HikeAnnotationSerializer < Blueprinter::Base
  identifier :id
  fields :copy, :point

  def self.thumbnail(blob)
    variant = blob.variant resize: '250x250^',
                           extent: '250x250',
                           gravity: 'Center'
    Rails.application.routes.url_helpers.url_for variant
  end

  field :images do |hike_annotation|
    if hike_annotation.images.attached?
      hike_annotation.images.select{ |i| i.blob.variable? }.map do |image|
        blob = image.blob
          {
            id: blob.id,
            path: Rails.application.routes.url_helpers.url_for(blob),
            metadata: blob.metadata,
            filename: "#{blob.filename}",
            content_type: blob.content_type,
            thumbnail_path: self.thumbnail(blob)
          }
      end
    end
  end
end
