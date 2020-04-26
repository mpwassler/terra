class Hike < ApplicationRecord
  belongs_to :user
  has_many :recordings, dependent: :destroy
  has_many :hike_annotations,
           -> { order(:created_at => :asc) },
           dependent: :destroy

  has_one_attached :cover_image
end
