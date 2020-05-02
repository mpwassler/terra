require 'rails_helper'

RSpec.feature "HikesFeatures", type: :feature do
  let :user do
    User.create! username:              'tester',
                 email:                 'test@user.com',
                 password:              'secret',
                 password_confirmation: 'secret'
  end

  scenario 'User uploads a new GPX file' do
    sign_in user
    visit '/hikes/new'
    attach_file 'hike[path_file]', file_fixture('sample.gpx'), make_visible: true
    click_button 'Create Hike'
    expect(page).to have_text 'Hike was successfully created.'
  end
end
