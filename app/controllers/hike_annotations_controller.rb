class HikeAnnotationsController < ApplicationController

  def create
    @hike_annotation = AnnotationCreator.new(params).call    
    if @hike_annotation.save        
        render json: hike_annotation_json, status: :created, location: @hike_annotation
    else
        render json: @hike_annotation.errors, status: :unprocessable_entity
    end   
  end 

  private
    def hike_annotation_json
      HikeAnnotationSerializer.render(@hike_annotation)
    end
end
