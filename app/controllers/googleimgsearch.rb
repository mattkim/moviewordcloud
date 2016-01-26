require 'simplehttp'
require 'logger'

class Googleimgsearch

  def initialize()
    @shttp = Simplehttp.new
  end

  # Uses both ways of getting movie posters
  # legacy google image search api and current google custom search
  def getImgURL(title, year)
    title = URI.escape(title + " " + year.to_s + " movie poster")
    req = "https://www.googleapis.com/customsearch/v1?key=AIzaSyAyLoJQc-3aOYZLlHff3S4JPmeK88rL878&cx=015799936154194163641:2d_yj8n3fbm&q="+title+"&searchType=image"#&imgSize=medium"
    img_results = JSON.parse(@shttp.call(req))
    if img_results && img_results["items"]
      img_results["items"].each do |img_result|
        link = img_result["link"]

        begin
          # Return the first link that gives a 200
          if @shttp.head(link) == "200"
            return link
          else
            Rails.logger.warn "Link inaccessible, skipping to next one..."
          end
        rescue Exception => ex
          Rails.logger.error ex.message
        end
      end
    end

    # Return empty string if we don't find anything
    return ""
  end

  def getLegacyImgURL(title, year)
    #title = URI.escape(title + " media-imdb movie poster")
    title = URI.escape(title + " " + year.to_s + " media.tumblr movie poster -impawards -imdb -collider")
    req = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + title
    img_results = JSON.parse(@shttp.call(req))
    if img_results && img_results["responseData"] && img_results["responseData"]["results"]
      return img_results["responseData"]["results"][0]["url"]
    else
      return ""
    end
  end

end
