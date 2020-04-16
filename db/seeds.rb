# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

def hike_from_file file_name, name
  path = "#{::Rails.root}/spec/fixtures/files/#{file_name}"
  file = File.open(path)
  GpxImporterService.new(file).call.tap do |hike|
  	hike.name = name
  end
end

Hike.destroy_all
hike_from_file('maroon_peak.gpx', 'Maroon Peak').save
hike_from_file('big_pine.gpx', 'Big Pine Creek').save
hike_from_file('bright_angel.gpx', 'Bright Angel').save
hike_from_file('chicago_basin.gpx', 'Chicago Basin').save
hike_from_file('hornali.gpx', 'Hornali Hut').save
hike_from_file('machu_picchu.gpx', 'Machu Picchu').save
hike_from_file('mount_rainier.gpx', 'Mt Rainer').save
hike_from_file('mt_whitney.gpx', 'Mt Whitney').save
hike_from_file('tetons.gpx', 'Grand Teton').save