class Boringwordconfig

  def initialize()
  end

  def isBoringWord(word)
    if $boring_words[word]
      return true
    else
      return false
    end
  end

  $boring_words = {
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
end
