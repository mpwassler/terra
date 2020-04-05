class CreateMedia < ActiveRecord::Migration[6.0]
  def change
    create_table :media do |t|
      t.string :path
      t.references :hike_annotation, null: false, foreign_key: true
      t.string :type

      t.timestamps
    end
  end
end
