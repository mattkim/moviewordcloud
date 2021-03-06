// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

// Necessary to wait for DOM to load here.
var movies;
var currMovie;
var currImg;
var latestcloud = "#outcloud";

// Carousel vars
var scrolled = 0;
var imgwidth = 0;
var currPos = 0;

// Begining of function onload
$(function() {
  displayMovies();
  removeMovies();

  var $imgs = $("#movie-header img");

  $imgs.each(function(){
      $(this).load(function() {
        imgwidth = imgwidth + $(this)[0].clientWidth;
      });
  });

  $(".next").click(function() {
    moveRight();
  });

  $(".prev").click(function() {
    moveLeft();
  });

  $("#movie-header").on("swipeleft",function() {
    moveRight();
  });
  $("#movie-header").on("swiperight",function() {
    moveLeft();
  });
});
// End of function

function moveLeft() {
  if (scrolled > 0) {
    scrolled = scrolled - 300;
    $("#movie-header").scroll();
    $("#movie-header").animate({scrollLeft:scrolled},200);
  }
}

function moveRight() {
  currPos = $(window).width();
  if (scrolled < imgwidth - currPos) {
    scrolled = scrolled + 300;
    $("#movie-header").scroll();
    $("#movie-header").animate({scrollLeft:scrolled},200);
  }
}

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

    $("#" + imgid).on("swipeleft", function() {
      moveRight();
    });
    $("#" + imgid).on("swipeight", function() {
      moveLeft();
    });
  });

  var firstid = Object.keys(movies)[0];
  colorImage("img-" + firstid);
  addMovieData(firstid);
  addWordcloud(firstid);
}

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
  if ($(latestcloud).length && imgid != currImg) {
    $('#' + imgid).css("background","#7CF3D3");
  }
}

function leaveColorImg(imgid) {
  if ($(latestcloud).length && imgid != currImg) {
    $('#' + imgid).css("background","");
  }
}

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
    var word_array = m["word_map"];
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

    latestcloud = "#outcloud_word_" + (word_array.length - 1);

    $("#outcloud").css("width", $(window).width());
    $("#outcloud").jQCloud(word_array);
  }
}
