// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

// Necessary to wait for DOM to load here.
var movies;

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
  var movie = movies[Object.keys(movies)[0]];
  console.log(movie);
  var quotes = movie["word_list"];
  var rtlink = movie["rtlink"];

  // Add images
  Object.keys(movies).forEach(function (key) { 
    var m = movies[key];
    var imgid = "img-" + m["id"];
    var image = "<img id='"+ imgid +"' src='"+m["poster_detailed"]+"'></img>";

    $("#movie-header").append(image);

    $("#" + imgid).click(function() {
      alert(m["id"]);
    });
  });


  // Calculate word array
  // TODO: should be on the server side
  var word_array = generateWordArray(quotes);
  $("#outcloud").jQCloud(word_array);
}

function replaceWordcloud(event) {
    var id = event.data.id;
    var m = movies[id];
    var quotes = m["word_list"];
    var word_array = generateWordArray(quotes);

    $("#outcloud").empty();
    $("#outcloud").jQCloud(word_array);
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

