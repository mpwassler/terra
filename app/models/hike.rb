class Hike < ApplicationRecord
  has_many :recordings, dependent: :destroy
end
