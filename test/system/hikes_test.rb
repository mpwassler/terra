require "application_system_test_case"

class HikesTest < ApplicationSystemTestCase
  setup do
    @hike = hikes(:one)
  end

  test "visiting the index" do
    visit hikes_url
    assert_selector "h1", text: "Hikes"
  end

  test "creating a Hike" do
    visit hikes_url
    click_on "New Hike"

    fill_in "Distance", with: @hike.distance
    fill_in "Name", with: @hike.name
    fill_in "Vertical gain", with: @hike.vertical_gain
    click_on "Create Hike"

    assert_text "Hike was successfully created"
    click_on "Back"
  end

  test "updating a Hike" do
    visit hikes_url
    click_on "Edit", match: :first

    fill_in "Distance", with: @hike.distance
    fill_in "Name", with: @hike.name
    fill_in "Vertical gain", with: @hike.vertical_gain
    click_on "Update Hike"

    assert_text "Hike was successfully updated"
    click_on "Back"
  end

  test "destroying a Hike" do
    visit hikes_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Hike was successfully destroyed"
  end
end
