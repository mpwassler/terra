# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_04_161944) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "hike_annotations", force: :cascade do |t|
    t.geography "point", limit: {:srid=>4326, :type=>"st_point", :has_z=>true, :geographic=>true}
    t.string "copy"
    t.bigint "hike_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["hike_id"], name: "index_hike_annotations_on_hike_id"
  end

  create_table "hikes", force: :cascade do |t|
    t.string "name"
    t.decimal "distance"
    t.decimal "vertical_gain"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "media", force: :cascade do |t|
    t.string "path"
    t.bigint "hike_annotation_id", null: false
    t.string "type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["hike_annotation_id"], name: "index_media_on_hike_annotation_id"
  end

  create_table "recordings", force: :cascade do |t|
    t.bigint "hike_id", null: false
    t.geography "path", limit: {:srid=>4326, :type=>"geometry", :has_z=>true, :geographic=>true}
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["hike_id"], name: "index_recordings_on_hike_id"
  end

  add_foreign_key "hike_annotations", "hikes"
  add_foreign_key "media", "hike_annotations"
  add_foreign_key "recordings", "hikes"
end
