class Hike < ApplicationRecord
  has_many :recordings, dependent: :destroy
  has_many :hike_annotations, dependent: :destroy

  has_one_attached :cover_image
end
