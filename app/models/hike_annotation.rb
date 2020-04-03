class HikeAnnotation < ApplicationRecord
  belongs_to :hike

  def point
  	RGeo::GeoJSON.encode(self[:point])
  end
end
