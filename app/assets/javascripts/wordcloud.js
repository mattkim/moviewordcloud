// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

// Necessary to wait for DOM to load here.
var movies;
var latestcloud = "#outcloud";

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
  movies = $.parseJSON($("#movies").val());

  // Add images
  Object.keys(movies).forEach(function (key) { 
    var m = movies[key];
    var imgurl = m["poster_detailed"];
    var imgid = "img-" + key;
    var img = "<img id='"+ imgid +"' src='"+ imgurl +"' style='cursor:pointer;'></img>";

    $("#movie-header").append(img);

    $("#" + imgid).click(function() {
      addWordcloud(key);
    });
  });

  // Calculate word array
  // TODO: should be on the server side
  var firstid = Object.keys(movies)[0];
  addWordcloud(firstid);
}

function addWordcloud(id) {
  // Only add wordcloud if our latest wordcloud exists
  if ($(latestcloud).length) {
    var m = movies[id];
    var quotes = m["word_list"];
    var word_array = generateWordArray(quotes);
    latestcloud = "#outcloud_word_" + word_array.length;
    $("#outcloud").empty();
    $("#outcloud").jQCloud(word_array);
  }
}

// Calculates the word array used for word cloud
function generateWordArray(words) {
  // Create an array of word objects, each representing a word in the cloud
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
      var size = word_array_tmp[key];
      if(size > 2){
        size = size -1;
      }
      word_array.push({text: key, weight: size});
  }
  return word_array;
}

