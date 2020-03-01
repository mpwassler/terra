require 'test_helper'

class HikesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @hike = hikes(:one)
  end

  test "should get index" do
    get hikes_url
    assert_response :success
  end

  test "should get new" do
    get new_hike_url
    assert_response :success
  end

  test "should create hike" do
    assert_difference('Hike.count') do
      post hikes_url, params: { hike: { distance: @hike.distance, name: @hike.name, vertical_gain: @hike.vertical_gain } }
    end

    assert_redirected_to hike_url(Hike.last)
  end

  test "should show hike" do
    get hike_url(@hike)
    assert_response :success
  end

  test "should get edit" do
    get edit_hike_url(@hike)
    assert_response :success
  end

  test "should update hike" do
    patch hike_url(@hike), params: { hike: { distance: @hike.distance, name: @hike.name, vertical_gain: @hike.vertical_gain } }
    assert_redirected_to hike_url(@hike)
  end

  test "should destroy hike" do
    assert_difference('Hike.count', -1) do
      delete hike_url(@hike)
    end

    assert_redirected_to hikes_url
  end
end
