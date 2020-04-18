class HeicAnalyzer < ActiveStorage::Analyzer
  def self.accept?(blob)
    blob.content_type == "image/heic"
  end

  def metadata
  	Media::Conversions::HeicToJpeg.new(blob).call
  	{}
  end
end
