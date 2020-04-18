class HikeAnnotation < ApplicationRecord
  belongs_to :hike

  has_many_attached :images

  def point
  	RGeo::GeoJSON.encode(self[:point])
  end
end
