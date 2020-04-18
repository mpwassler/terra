class SearchController < ApplicationController
  def index
    @search_json = search_json
    respond_to do |format|
      format.html { render :index }
      format.json { render json: @search_json }
    end
  end

  private
    def search_results
      GeoproximityQuery.new(params)
                       .all
                       .includes :hike_annotations,
                                 :recordings
    end

    def search_json
      if params[:lon] && params[:lat]
        HikeSerializer.render search_results
      else
        {}
      end
    end
end
