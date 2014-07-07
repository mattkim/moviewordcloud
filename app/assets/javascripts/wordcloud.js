// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

// Necessary to wait for DOM to load here.
$(function() {
  displayMovies();
  removeMovies();
});

// Removes the hidden movies input
function removeMovies() {
  $("#movies").remove();
}

// Display movies using hidden movies input
function displayMovies() {
  // Fetch movies from hidden input field
  var movies = $.parseJSON($("#movies").val());

  // Iterate through every movie
  var quotes = "";
  var extra_boring_words = {};
  Object.keys(movies).forEach(function (key) { 
    var movie = movies[key];
    console.log(movie);
    quotes = movie["word_list"];

    // Calculate word array
    var word_array = generateWordArray(quotes);

    // Create div for each movie
    var newid = "movie" + movie["id"];
    $("#example").append("<div><h3>"+movie["title"]+", Critics Score: "+movie["critics_score"]+"<br/><img src='"+movie["poster_detailed"]+"'></img></h3></div><div id='" + newid + "' style='height:300px'></div>");

    // Create word cloud for each movie
    $("#" + newid).jQCloud(word_array);
  });
}

// Calculates the word array used for word cloud
function generateWordArray(words) {
  // Create an array of word objects, each representing a word in the cloud
  //var rando_text = "Long before Optimus Prime hoists his hulking metal frame onto the back of a giant robot dinosaur, wields his mighty sword and rides valiantly away to save the planet once more, Transformers: Age of Extinction plays like a parody You're either awestruck, dumbstruck or just plain struck in the face. Bay has said that this film will kick off a second trilogy of Transformers movies - and I think he's serious. That means there will be (at least) two more of these things. God help us all. I sincerely enjoyed the Transformer who was literally branded by Oreo.‪ The movie's crammed with useless nuts and bolts, the storytelling equivalent of a mechanic who lifts the hood of your car and says, That's everything, fix it yourself.Transfourmers, as I like to call it, is everything you could want in a big-budget tentpole, so long as what you want is sound and fury signifying nothing beyond a guarantee that more of the same is already on the way. The beginning and end of this film are too far apart. It could have been cut by an hour without missing anything important. It is just bloated with junk, including excessive product placement. Inflated, interminable and incoherent Can I make a citizen's arrest for assault with intent to bore to death? Big, dumb and fun. Transformers: Age Of Extinction provides action with zero tension. Michael Bay's latest exercise in excess is the biggest, longest, loudest, explodiest film ever made. The ploy Bay has used, unsuccessfully, is that as the story becomes more and more stupid, and the stupidity is jaw-dropping in its scope, the effects become bigger and bigger It's big, dumb and ugly, but you can also avoid it pretty readily if you want. Why are we here? What is the purpose of life on earth? And why are alien robots so hellbent on impersonating our automobiles?";
  var word_array_tmp = {};

  // Calculate counts for each number
  $(words).each(function(index,value) {
    count = word_array_tmp[value];
  	//console.log(count)
  	if (count === undefined) {
  		count = 1;
  	} else {
  		count = count + 1;
  	}
  	word_array_tmp[value] = count;
  });

  // Put it in word_array format
  var word_array = [];
  for (var key in word_array_tmp) {
  		word_array.push({text: key, weight: word_array_tmp[key]});
  }
  return word_array;
}

