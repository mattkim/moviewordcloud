require 'boringwordconfig'

class Wordcloudgen

  def initialize()
    @bwcfg = Boringwordconfig.new
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
      if !@bwcfg.isBoringWord(word) && !extraBoringWords.include?(word)
        wordlist.push(word)
      end
    end
    return wordlist
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
