require "mini_magick"
module Media::Conversions
  class HeicToJpeg
    def initialize(blob)
      @blob     = blob
      @tmp_path = "tmp/#{blob.key}.jpg"
      @filename = parse_filename blob.filename.to_s
    end

    def call
      @blob.open tmpdir: Dir.tmpdir do |file|
        convert_image file
      end
      cleanup
    end

    private
      def parse_filename(name)
        name.sub! 'HEIC', 'jpg'
      end

      def convert_image(file)
        image = MiniMagick::Image.new(file.path)
        image.format('jpg')
        image.write @tmp_path
        record = @blob.attachments.first.record
        record.images.attach io: File.open(@tmp_path),
                             filename: @filename
      end

      def cleanup
        File.delete(@tmp_path) if File.exist?(@tmp_path)
        @blob.attachments.first.purge_later
      end
  end
end
