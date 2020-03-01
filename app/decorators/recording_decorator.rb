class RecordingDecorator
  def initialize(recording)
    @recording = recording
  end

  def elevation_change
    z_values.max - z_values.min
  end

  def length
    @recording.path.length
  end

  private
    def z_values
      @recording.path.points.map { |p| p.z }
    end
end
