class GeoproximityQuery
	
	POSTGIS = <<-SQL		
		ST_DWithin(
			recordings.path, 
			ST_GeomFromText('POINT(:lon :lat)'), 
			:distance * 1609.34
		)
	SQL

	def initialize(params = {}, relation = Hike.all)
		@relation = relation
		@params = params
	end

	def all
		@relation
			.joins(:recordings)
			.where( POSTGIS, { lon: @params[:lon].to_f, 
							   lat: @params[:lat].to_f, 
							   distance: @params[:distance].to_i })
	end
end