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
  //Object.keys(movies).forEach(function (key) { 
    //var movie = movies[key];
    console.log(Object.keys(movies)[0]);
    var movie = movies[Object.keys(movies)[0]];
    console.log(movie);
    quotes = movie["word_list"];
    rtlink = movie["rtlink"];

    // Calculate word array
    var word_array = generateWordArray(quotes);

    // Unique movie id per div
    var newid = "movie" + movie["id"];

    // Create dynamic wordclouds here.

    // Define basic elements
    var li = $("<li/>",{
      class: "wcli"
    });

    var headerrow = $("<div/>",{
      class: "row wcrow"
    });


    var content = $("<div/>", {
        id: newid,
        class: "wccontent"
    });     

    Object.keys(movies).forEach(function (key) { 
      var m = movies[key];
      var image = $("<div/>", {
        class: "small-1 columns"
      }).append("<img src='"+m["poster_detailed"]+"'></img>");

      var title = $("<div/>", {
        class: "small-10 medium-10 large-10 columns right wctitle"
      }).append("<a href='"+rtlink+"'>"+m["title"]+"</a><br/><p>Critics Score: "+m["critics_score"]+"</p>");
      //$("#movie-header").append(title);
      $("#movie-header").append(image);
    });

    // Create heirarchy
    //$("#example").append(li);
    //li.append(headerrow);
    //li.append(content);
    //headerrow.append(image);
    //headerrow.append(title);

    // Create word cloud for each movie
    // Kind of annoying but this div is not truly responsive -- and gets stuck in the original window size
    //$("#" + newid).jQCloud(word_array);
    //
    $("#example").jQCloud(word_array);
  //});
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

