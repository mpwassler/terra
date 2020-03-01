class CreateRecordings < ActiveRecord::Migration[6.0]
  def change
    create_table :recordings do |t|
      t.references :hike, null: false, foreign_key: true
      t.geometry :path, has_z: true, geographic: true

      t.timestamps
    end
  end
end
