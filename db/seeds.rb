# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

def hike_from_file file_name, name, user
  path = "#{::Rails.root}/spec/fixtures/files/#{file_name}"
  file = File.open(path)
  GpxImporterService.new(file, user)
                    .call
                    .tap { |hike| hike.name = name }
end

User.destroy_all
test_user =       User.create! username:              'Johnny Utah',
                               email:                 'test@user.com',
                               password:              'secret',
                               password_confirmation: 'secret'

test_subscriber = User.create! username:              'Bodhi',
                               email:                 'test@subscriber.com',
                               password:              'secret',
                               password_confirmation: 'secret'

Hike.destroy_all
hike_date = [
  ['maroon_peak.gpx', 'Maroon Peak'],
  ['big_pine.gpx', 'Big Pine Creek'],
  ['bright_angel.gpx', 'Bright Angel'],
  ['chicago_basin.gpx', 'Chicago Basin'],
  ['hornali.gpx', 'Hornali Hut'],
  ['machu_picchu.gpx', 'Machu Picchu'],
  ['mount_rainier.gpx', 'Mt Rainer'],
  ['mt_whitney.gpx', 'Mt Whitney'],
  ['tetons.gpx', 'Grand Teton'],
]
hike_date.each_with_index do |file, index|
  user = index % 2 == 0 ? test_user : test_subscriber
  hike_from_file(file[0], file[1], user).save
end
