require 'net/http'
require 'net/https'
require 'json'

class WordcloudController < ApplicationController
  def index
    @movies = getMovies()
  end

  # Uses both ways of getting movie posters
  # legacy google image search api and current google custom search
  def getImgURL(title)
    title = URI.escape(title + " media-imdb movie poster")
    req = "https://www.googleapis.com/customsearch/v1?key=AIzaSyAyLoJQc-3aOYZLlHff3S4JPmeK88rL878&cx=015799936154194163641:2d_yj8n3fbm&q="+title+"&searchType=image"
    img_results = JSON.parse(call_ssl(req))
    if img_results && img_results["items"]
      return img_results["items"][0]["link"]
    else
      return ""
    end
  end

  def getLegacyImgURL(title)
    #title = URI.escape(title + " media-imdb movie poster")
    title = URI.escape(title + " media.tumblr movie poster -impawards -imdb -collider")
    req = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + title
    img_results = JSON.parse(call_ssl(req))
    if img_results && img_results["responseData"] && img_results["responseData"]["results"]
      return img_results["responseData"]["results"][0]["url"]
    else
      return ""
    end
  end

  def getMovies
      box_office_movies_uri = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?apikey=crwupvtm57dx5nu38f9nhyef"
      reviews_template = "http://api.rottentomatoes.com/api/public/v1.0/movies/%s/reviews.json?apikey=crwupvtm57dx5nu38f9nhyef"

      box_office_movies = JSON.parse(call(box_office_movies_uri))

      # Create movies struct      
      movies = Hash.new
      box_office_movies["movies"].each do |movie|
        id = movie["id"]
        title = movie["title"]
        poster_detailed = movie["posters"]["detailed"]
        poster_original = movie["posters"]["original"]
        poster_thumbnail = movie["posters"]["thumbnail"]
        poster_profile = movie["posters"]["profile"]
        critics_score = movie["ratings"]["critics_score"]
        rtlink = movie["links"]["alternate"]

        # Get reviews        
        reviews_url = reviews_template % [id]

        # Adding basic retries
        got_reviews = false
        curr_retries = 0
        while !got_reviews && curr_retries < 3 do
          reviews = JSON.parse(call(reviews_url))
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

        # Use levenshtein dist to calculate word similarity
        word_list = cleanWords(quotes.split)
        extraBoringWords = cleanWords(title.split)
        word_list = removeBoringWords(word_list, extraBoringWords)
        #exp_words = expWords(word_list)
        
        #gimg = getImgURL(title)

        # Fallback to legacy google image search api
        #if gimg == ""
        gimg = getLegacyImgURL(title)
        #end

        # Finalize struct
        movies[id] = {"id" => id,
                      "title" => title,
                      "rtlink" => rtlink,
                      "word_list" => word_list,
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

  def call(url)
    uri = URI.parse(url)
    req = Net::HTTP::Get.new(uri.to_s)
    res = Net::HTTP.start(uri.host, uri.port) {|http|http.request(req)}
    return res.body
  end

  def call_ssl(url)
    uri = URI.parse(url)
    req = Net::HTTP::Get.new(uri.to_s)
    res = Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == 'https', :verify_mode => OpenSSL::SSL::VERIFY_NONE) {|http|http.request(req)}
    return res.body
  end

  def cleanWords(words)
    cleanWords = []
    words.each do |word|
      word = cleanWord(word)
      cleanWords.push(word)
    end

    return cleanWords
  end

  def cleanWord(word)
    # note that using ruby's pluarlization doesn't work here because of too many false-positives
    # reges to remove 's from a word
    word = word.gsub(/'s$/, '')
    # regex to remove non alphanums
    word = word.gsub(/[^\p{Alnum}]/, '')
    # lowercase
    word = word.downcase
    return word
  end

  def removeBoringWords(words, extraBoringWords)
    wordlist = []
    words.each do |word|
      word = cleanWord(word)

      # Only add the word if it's not a boring word
      if !isBoringWord(word) && !extraBoringWords.include?(word)
        wordlist.push(word)
      end
    end
    return wordlist
  end

  def isBoringWord(word)
    boring_words = {
      # Manually listed words
      "and"=>true,"of"=>true,"the"=>true,"if"=>true,"on"=>true,"a"=>true,"is"=>true,"in"=>true,"i"=>true,"with"=>true,"as"=>true,"to"=>true,"has"=>true,"just"=>true,
      "are"=>true,"by"=>true,"so"=>true,"can"=>true,"but"=>true,"could"=>true,"film"=>true,"movie"=>true,"for"=>true,"have"=>true,"while"=>true,"at"=>true,"be"=>true,"into"=>true,
      "than"=>true,"from"=>true,"an"=>true,"movies"=>true,
      # Most common meaningless words
      "all"=>true,
      "another"=>true,
      "any"=>true,
      "anybody"=>true,
      "anyone"=>true,
      "anything"=>true,
      "both"=>true,
      "each"=>true,
      "either"=>true,
      "everybody"=>true,
      "everyone"=>true,
      "everything"=>true,
      "few"=>true,
      "he"=>true,
      "her"=>true,
      "hers"=>true,
      "herself"=>true,
      "him"=>true,
      "himself"=>true,
      "his"=>true,
      "I"=>true,
      "it"=>true,
      "its"=>true,
      "itself"=>true,
      "many"=>true,
      "me mine"=>true,
      "more"=>true,
      "most"=>true,
      "much"=>true,
      "my"=>true,
      "myself"=>true,
      "neither"=>true,
      "no one"=>true,
      "nobody"=>true,
      "none"=>true,
      "nothing"=>true,
      "one"=>true,
      "other"=>true,
      "others"=>true,
      "our"=>true,
      "ours"=>true,
      "ourselves"=>true,
      "several"=>true,
      "she"=>true,
      "some"=>true,
      "somebody"=>true,
      "someone"=>true,
      "something"=>true,
      "that"=>true,
      "their"=>true,
      "theirs"=>true,
      "them"=>true,
      "themselves"=>true,
      "these"=>true,
      "they"=>true,
      "this"=>true,
      "those"=>true,
      "us"=>true,
      "we"=>true,
      "what"=>true,
      "whatever"=>true,
      "which"=>true,
      "whichever"=>true,
      "who"=>true,
      "whoever"=>true,
      "whom"=>true,
      "whomever"=>true,
      "whose"=>true,
      "you"=>true,
      "your"=>true,
      "yours"=>true,
      "yourself"=>true,
      "yourselves"=>true
      }
    
    if boring_words[word]
      return true
    else
      return false
    end
  end

  # Note this calculation of the levenshtein dist takes a long time
  def expWords(words)
    expWords = []
    matches = {}
    words.each do |word|
      # compute l dist of each word to all other words
      words.each do |word2|
        # This if statement is kind of unnecessary
        if !matches[word]

          dist = ldist(word,word2)
          # if we find a good match we need to group them together / but i also need to go through the counts
          if dist > 0 && dist < 2
            matchWords = matches[word]
            if !matchWords
              matchWords = []
            end
            matchWords.push(word2)
            matches[word] = matchWords
          end
        end
      end

    end

    return matches
  end

  def ldist(s, t)
    m = s.length
    n = t.length
    return m if n == 0
    return n if m == 0
    d = Array.new(m+1) {Array.new(n+1)}

    (0..m).each {|i| d[i][0] = i}
    (0..n).each {|j| d[0][j] = j}
    (1..n).each do |j|
      (1..m).each do |i|
        d[i][j] = if s[i-1] == t[j-1]  # adjust index into string
                    d[i-1][j-1]       # no operation required
                  else
                    [ d[i-1][j]+1,    # deletion
                      d[i][j-1]+1,    # insertion
                      d[i-1][j-1]+1,  # substitution
                    ].min
                  end
      end
    end
    d[m][n]
  end
end
