class AddUsersToHikes < ActiveRecord::Migration[6.0]
  def change
    add_reference :hikes, :user, foreign_key: true
  end
end
