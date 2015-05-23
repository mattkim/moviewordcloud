require 'net/http'
require 'net/https'
require 'json'
require 'wordcloudgen'
require 'googleimgsearch'
require 'simplehttp'

class WordcloudController < ApplicationController
  def index
    @wcg = Wordcloudgen.new
    @shttp = Simplehttp.new
    @gis = Googleimgsearch.new

    movies = getCachedMovies()

    if !movies
      movies = getMovies()
    end

    cacheMovies(movies)

    @movies = movies
  end

  def getCachedMovies
    return REDIS.get("movies")
  end

  def cacheMovies(movies)
    REDIS.set("movies",movies)
    # 1 day
    REDIS.expire("movies",86400)
  end

  def getMovies
      box_office_movies_uri = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?apikey=crwupvtm57dx5nu38f9nhyef"
      reviews_template = "http://api.rottentomatoes.com/api/public/v1.0/movies/%s/reviews.json?apikey=crwupvtm57dx5nu38f9nhyef"

      box_office_movies = JSON.parse(@shttp.call(box_office_movies_uri))

      # Create movies struct
      movies = Hash.new
      box_office_movies["movies"].each do |movie|
        id = movie["id"]
        title = movie["title"]
        year = movie["year"]
        poster_detailed = movie["posters"]["detailed"]
        poster_original = movie["posters"]["original"]
        poster_thumbnail = movie["posters"]["thumbnail"]
        poster_profile = movie["posters"]["profile"]
        critics_score = movie["ratings"]["critics_score"]
        rtlink = movie["links"]["alternate"]

        # Get reviews
        reviews_url = reviews_template % [id]

        # Adding basic retries
        reviews = @shttp.call_retry(reviews_url, "reviews")

        # Compile all comments together
        quotes = ""
        if reviews["reviews"]
          reviews["reviews"].each do |review|
            quotes += review["quote"] + " "
          end
        end

        word_map = @wcg.genWordMap(quotes, title)
        gimg = @gis.getImgURL(title, year)

        # Finalize struct
        movies[id] = {"id" => id,
                      "title" => title,
                      "rtlink" => rtlink,
                      "word_map" => word_map,
                      "critics_score" => critics_score,
                      "poster_original" => poster_original,
                      "poster_detailed" => poster_detailed,
                      "poster_profile" => poster_profile,
                      "poster_thumbnail"=>poster_thumbnail,
                      "gimg" => gimg
        }
      end

      return movies.to_json
  end

end
