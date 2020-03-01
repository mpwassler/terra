json.extract! hike, :id, :name, :distance, :vertical_gain, :created_at, :updated_at
json.url hike_url(hike, format: :json)
