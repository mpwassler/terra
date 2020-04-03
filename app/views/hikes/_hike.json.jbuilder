json.extract! hike, :id, :name, :distance, :path, :vertical_gain, :created_at, :updated_at
json.url hike_url(hike, format: :json)
