require 'net/http'
require 'json'

class WordcloudController < ApplicationController
  def index
    @movies = getMovies()
  end

  #TODO: add retries here 
  def callRottenTomato(url)
  	uri = URI.parse(url)
    req = Net::HTTP::Get.new(uri.to_s)
    res = Net::HTTP.start(uri.host, uri.port) {|http|http.request(req)}
    return res.body
  end

  def getMovies
  	box_office_movies_uri = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?apikey=crwupvtm57dx5nu38f9nhyef"
    reviews_template = "http://api.rottentomatoes.com/api/public/v1.0/movies/%s/reviews.json?apikey=crwupvtm57dx5nu38f9nhyef"

  	box_office_movies = JSON.parse(callRottenTomato(box_office_movies_uri))

    # Create movies struct  	
  	movies = Hash.new
  	box_office_movies["movies"].each do |movie|
  	  id = movie["id"]
  	  title = movie["title"]
      poster_detailed = movie["posters"]["detailed"]
      poster_original = movie["posters"]["original"]
      critics_score = movie["ratings"]["critics_score"]

      # Get reviews  	  
      reviews_url = reviews_template % [id]

      # Adding basic retries
      got_reviews = false
      curr_retries = 0
      while !got_reviews && curr_retries < 3 do

  	    reviews = JSON.parse(callRottenTomato(reviews_url))
        
        if reviews["reviews"]
          got_reviews = true
        else
          sleep(1)
          curr_retries = curr_retries + 1
        end
      end

      # Compile all comments together
  	  quotes = ""
  	  if reviews["reviews"]
  	    reviews["reviews"].each do |review|
  	      quotes += review["quote"] + " "
  	    end
  	  end

      # Finalize struct
  	  movies[id] = {"id" => id, "title" => title, "quotes" => quotes, "critics_score" => critics_score, "poster_original" => poster_original, "poster_detailed" => poster_detailed}
  	end

  	return movies.to_json
  end

end
