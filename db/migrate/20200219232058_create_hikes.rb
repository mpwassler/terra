class CreateHikes < ActiveRecord::Migration[6.0]
  def change
    create_table :hikes do |t|
      t.string :name
      t.decimal :distance
      t.decimal :vertical_gain

      t.timestamps
    end
  end
end
