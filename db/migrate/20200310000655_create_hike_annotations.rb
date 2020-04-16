class CreateHikeAnnotations < ActiveRecord::Migration[6.0]
  def change
    create_table :hike_annotations do |t|
      t.st_point :point, has_z: true, geographic: true
      t.string :copy
      t.references :hike, null: false, foreign_key: true

      t.timestamps
    end
  end
end
