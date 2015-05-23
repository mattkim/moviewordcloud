// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

// Necessary to wait for DOM to load here.
var movies;
var latestcloud = "#outcloud";

// Begining of function onload
$(function() {
  displayMovies();
  removeMovies();

  scrolled = 0;

  var imgwidth = 0;
  var currPos = 0;

  var $imgs = $("#movie-header img");

  $imgs.each(function(){
      $(this).load(function() {
        imgwidth = imgwidth + $(this)[0].clientWidth;
      });
  });

  $(".next").click(function() {
    currPos = $(this)[0].offsetLeft + ($(this)[0].offsetWidth / 2);
    if (scrolled < imgwidth - currPos) {
      scrolled = scrolled + 300;
      $("#movie-header").scroll();
      $("#movie-header").animate({scrollLeft:scrolled},200);

      if (scrolled < imgwidth - currPos) {
        $(this).css("opacity","1");
      } else {
        $(this).css("opacity",".25");
      }
    }

    if (scrolled > 0) {
      $(".prev").css("opacity","1");
    } else {
      $(".prev").css("opacity",".25");
    }
  });

  $(".prev").click(function() {
    currPos = $(this)[0].offsetLeft + ($(this)[0].offsetWidth / 2);

    if (scrolled > 0) {
      scrolled = scrolled - 300;
      $("#movie-header").scroll();
      $("#movie-header").animate({scrollLeft:scrolled},200);
      if (scrolled > 0) {
        $(this).css("opacity","1");
      } else {
        $(this).css("opacity",".25");
      }
    }

    if (scrolled < imgwidth - currPos) {
      $(".next").css("opacity","1");
    } else {
      $(".next").css("opacity",".25");
    }
  });
});
// End of function

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
    //console.log(m)
    //var imgurl = m["poster_detailed"];
    var imgurl = m["gimg"];
    var imgid = "img-" + key;
    var img = "<img id='"+ imgid +"' src='"+ imgurl +"'></img>";

    $("#movie-header").append(img);

    $("#" + imgid).click(function() {
      colorImage(imgid);
      addMovieData(key);
      addWordcloud(key);
    });

    $("#" + imgid).hover(function() {
      hoverMovieData(key);
      hoverColorImg(imgid);
    },
    function() {
      leaveMovieData(key);
      leaveColorImg(imgid);
    });
  });

  // Calculate word array
  // TODO: should be on the server side
  var firstid = Object.keys(movies)[0];
  colorImage("img-" + firstid);
  addMovieData(firstid);
  addWordcloud(firstid);
}

var currImg;

function colorImage(imgid) {
  if ($(latestcloud).length) {
    if(currImg){
      $('#' + currImg).css("background","");
    }
    $('#' + imgid).css("background","#51C3AA");
    currImg = imgid;
  }
}

function hoverColorImg(imgid) {
  if ($(latestcloud).length) {
    $('#' + imgid).css("background","#7CF3D3");
  }
}

function leaveColorImg(imgid) {
  if ($(latestcloud).length) {
    $('#' + imgid).css("background","");
  }
}

var currMovie;

function hoverMovieData(id) {
  if ($(latestcloud).length) {
    currMovie = $("#movie-data").html();
    var m = movies[id];
    var title = m["title"];
    $("#movie-data").empty();
    $("#movie-data").append(title);
  }
}

function leaveMovieData(id) {
  $("#movie-data").empty();
  $("#movie-data").append(currMovie);
}

function addMovieData(id) {
  if ($(latestcloud).length) {
    var m = movies[id];
    var title = m["title"];
    $("#movie-data").empty();
    $("#movie-data").append(title);
    currMovie = $("#movie-data").html();
  }
}

function addWordcloud(id) {
  // Only add wordcloud if our latest wordcloud exists
  if ($(latestcloud).length) {
    var m = movies[id];
    var quotes = m["word_list"];
    var word_array = generateWordArray(quotes);
    latestcloud = "#outcloud_word_" + (word_array.length - 1);
    // console.log(latestcloud);
    $("#outcloud").empty();

    width = $(window).width();
    if (width >= 800) {
      $("#outcloud").css("height", 300);
      $("#outcloud").css("margin-top", 15);
    } else {
      $("#outcloud").css("height", 500);
      $("#outcloud").css("margin-top", 0);
      word_array = word_array.slice(0, word_array.length/2);
    }

    $("#outcloud").css("width", $(window).width());
    $("#outcloud").jQCloud(word_array);
  }
}

// Calculates the word array used for word cloud
function generateWordArray(words) {
  // TODO: on mobile we should limit number of words displayed to half?
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

  // We should sort desc by size.
  for(i = 1; i < word_array.length; i++) {
    for(j = 1; j <= i; j++) {
      if(word_array[j]["weight"] > word_array[j-1]["weight"]) {
        var tmp = word_array[j-1];
        word_array[j-1] = word_array[j];
        word_array[j] = tmp;
      }
    }
  }

  return word_array;
}

