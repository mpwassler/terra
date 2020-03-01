require 'rails_helper'

RSpec.feature "HikesFeatures", type: :feature do
  scenario 'User uploads a new GPX file' do
    visit '/hikes/new'
    attach_file 'hike[path_file]', file_fixture('sample.gpx')
    click_button 'Create Hike'
    expect(page).to have_text 'Hike was successfully created.'
  end
end
