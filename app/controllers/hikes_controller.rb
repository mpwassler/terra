class HikesController < ApplicationController
  before_action :set_hike, only: [:show, :edit, :update, :destroy]

  # GET /hikes
  # GET /hikes.json
  def index
    @hikes = Hike.all
  end

  # GET /hikes/1
  # GET /hikes/1.json
  def show
    @hike_json = HikeSerializer.new(@hike).to_json
    respond_to do |format|
      format.html { render :show }
      format.json { render json: @hike_json }
    end
  end

  # GET /hikes/new
  def new
    @hike = Hike.new
  end

  # GET /hikes/1/edit
  def edit
  end

  # POST /hikes
  # POST /hikes.json
  def create
    @hike = GpxImporterService.new(hike_params[:path_file]).call
    respond_to do |format|
      if @hike.save
        format.html { redirect_to @hike, notice: 'Hike was successfully created.' }
        format.json { render :show, status: :created, location: @hike }
      else
        format.html { render :new }
        format.json { render json: @hike.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /hikes/1
  # PATCH/PUT /hikes/1.json
  def update
    respond_to do |format|
      if @hike.update(hike_params)
        format.html { redirect_to @hike, notice: 'Hike was successfully updated.' }
        format.json { render :show, status: :ok, location: @hike }
      else
        format.html { render :edit }
        format.json { render json: @hike.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /hikes/1
  # DELETE /hikes/1.json
  def destroy
    @hike.destroy
    respond_to do |format|
      format.html { redirect_to hikes_url, notice: 'Hike was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_hike
      @hike = Hike.includes(:recordings).find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def hike_params
      params.require(:hike).permit(:name, :path_file)
    end
end
