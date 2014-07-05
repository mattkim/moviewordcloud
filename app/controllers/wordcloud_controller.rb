require 'net/http'
require 'json'

class WordcloudController < ApplicationController
  def index
  end

  def callRottenTomato(url)
  	uri = URI.parse(url)
    req = Net::HTTP::Get.new(uri.to_s)
    res = Net::HTTP.start(uri.host, uri.port) {|http|http.request(req)}
    return res.body
  end

  def test
  	box_office_movies_uri = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?apikey=crwupvtm57dx5nu38f9nhyef"
    reviews_template = "http://api.rottentomatoes.com/api/public/v1.0/movies/%s/reviews.json?apikey=crwupvtm57dx5nu38f9nhyef"

  	box_office_movies = JSON.parse(callRottenTomato(box_office_movies_uri))

    # Create movies struct  	
  	@movies = Hash.new
  	box_office_movies["movies"].each do |movie|
  	  id = movie["id"]
  	  title = movie["title"]

  	  reviews_url = reviews_template % [id]
  	  reviews = JSON.parse(callRottenTomato(reviews_url))

      # Compile all comments together
  	  quotes = "test test test1 test1 test2"
  	  #reviews["reviews"].each do |review|
  	  #	quotes += review["quote"] + " "
  	  #end

  	  critics_score = movie["ratings"]["critics_score"]

      # Finalize struct
  	  @movies[id] = {"id" => id, "title" => title, "quotes" => quotes, "critics_score" => critics_score}
  	end

  	render json: @movies
  end

end
