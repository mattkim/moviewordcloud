// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jqcloud
//= require foundation
//= require turbolinks
//= require_tree .

boring_words = {
"and":true,"of":true,"the":true,"if":true,"on":true,"a":true,"is":true,"in":true,"i":true,"with":true,"as":true,"to":true,"has":true,"just":true,
"are":true,"by":true,"so":true,"can":true,"but":true,"could":true,"film":true,"movie":true,"for":true,"have":true,"while":true,"at":true,"be":true,"into":true,

"all":true,
"another":true,
"any":true,
"anybody":true,
"anyone":true,
"anything":true,
"both":true,
"each":true,
"either":true,
"everybody":true,
"everyone":true,
"everything":true,
"few":true,
"he":true,
"her":true,
"hers":true,
"herself":true,
"him":true,
"himself":true,
"his":true,
"I":true,
"it":true,
"its":true,
"itself":true,
"many":true,
"me mine":true,
"more":true,
"most":true,
"much":true,
"my":true,
"myself":true,
"neither":true,
"no one":true,
"nobody":true,
"none":true,
"nothing":true,
"one":true,
"other":true,
"others":true,
"our":true,
"ours":true,
"ourselves":true,
"several":true,
"she":true,
"some":true,
"somebody":true,
"someone":true,
"something":true,
"that":true,
"their":true,
"theirs":true,
"them":true,
"themselves":true,
"these":true,
"they":true,
"this":true,
"those":true,
"us":true,
"we":true,
"what":true,
"whatever":true,
"which":true,
"whichever":true,
"who":true,
"whoever":true,
"whom":true,
"whomever":true,
"whose":true,
"you":true,
"your":true,
"yours":true,
"yourself":true,
"yourselves":true,
"’":true,
"'":true,
"[":true,
"]":true,
"(":true,
")":true,
"{":true,
"}":true,
"⟨":true,
"⟩":true,
":":true,
",":true,
"،":true,
"、":true,
"‒":true,
"–":true,
"—":true,
"―":true,
"…":true,
"...":true,
".":true,
".":true,
".":true,
"!":true,
".":true,
"‐":true,
"-":true,
"?":true,
"‘":true,
"’":true,
"“":true,
"”":true,
"'":true,
"'":true,
"\"":true,
"\"":true,
";":true,
"/":true,
"⁄":true,
"&":true,
"*":true,
"@":true,
"\\":true,
"•":true,
"^":true,
"†":true,
"‡":true,
"°":true,
"″":true,
"¡":true,
"¿":true,
"#":true,
"№":true,
"÷":true,
"º":true,
"ª":true,
"%":true,
"‰":true,
"+":true,
"−":true,
"‱":true,
"¶":true,
"′":true,
"″":true,
"‴":true,
"§":true,
"~":true,
"_":true,
"|":true,
"‖":true,
"¦":true
};

var punct_marks = [
"’",
"'",
"[",
"]",
"(",
")",
"{",
"}",
"⟨",
"⟩",
":",
",",
"،",
"、",
"‒",
"–",
"—",
"―",
"…",
"...",
".",
".",
".",
"!",
".",
"‐",
"-",
"?",
"‘",
"’",
"“",
"”",
"'",
"'",
"\"",
"\"",
";",
"/",
"⁄",
"&",
"*",
"@",
"\\",
"•",
"^",
"†",
"‡",
"°",
"″",
"¡",
"¿",
"#",
"№",
"÷",
"º",
"ª",
"%",
"‰",
"+",
"−",
"‱",
"¶",
"′",
"″",
"‴",
"§",
"~",
"_",
"|",
"‖",
"¦"
];

$(function(){ $(document).foundation(); });

// Make ajax call to get the data from RT
$.ajax({url: "/wordcloud/test"}).done(function(movies){
  // add divs
  // $("#example2").append(JSON.stringify(movies));
  // console.log(word_array);
  var quotes = "";
  var extra_boring_words = {};
  Object.keys(movies).forEach(function (key) { 
    var movie = movies[key];
    console.log(movie);
    quotes = movie["quotes"];

    $(movie["title"].split(" ")).each(function(index,value){
        extra_boring_words[value.toLowerCase()] = true;
    });

    var word_array = generateWordArray(quotes, extra_boring_words);

    // Create div
    var newid = "movie" + movie["id"];
    $("#example").append("<div><h2>"+movie["title"]+"</h2> <h3>Critics Score: "+movie["critics_score"]+"</h3></div><div id='" + newid + "' style='height:300px'></div>");

    // add function to it
    $(function() {
      // When DOM is ready, select the container element and call the jQCloud method, passing the array of words as the first argument.
      $("#" + newid).jQCloud(word_array);
    });
  });
});

function generateWordArray(words, extra_boring_words) {
  // Create an array of word objects, each representing a word in the cloud
  //var rando_text = "Long before Optimus Prime hoists his hulking metal frame onto the back of a giant robot dinosaur, wields his mighty sword and rides valiantly away to save the planet once more, Transformers: Age of Extinction plays like a parody You're either awestruck, dumbstruck or just plain struck in the face. Bay has said that this film will kick off a second trilogy of Transformers movies - and I think he's serious. That means there will be (at least) two more of these things. God help us all. I sincerely enjoyed the Transformer who was literally branded by Oreo.‪ The movie's crammed with useless nuts and bolts, the storytelling equivalent of a mechanic who lifts the hood of your car and says, That's everything, fix it yourself.Transfourmers, as I like to call it, is everything you could want in a big-budget tentpole, so long as what you want is sound and fury signifying nothing beyond a guarantee that more of the same is already on the way. The beginning and end of this film are too far apart. It could have been cut by an hour without missing anything important. It is just bloated with junk, including excessive product placement. Inflated, interminable and incoherent Can I make a citizen's arrest for assault with intent to bore to death? Big, dumb and fun. Transformers: Age Of Extinction provides action with zero tension. Michael Bay's latest exercise in excess is the biggest, longest, loudest, explodiest film ever made. The ploy Bay has used, unsuccessfully, is that as the story becomes more and more stupid, and the stupidity is jaw-dropping in its scope, the effects become bigger and bigger It's big, dumb and ugly, but you can also avoid it pretty readily if you want. Why are we here? What is the purpose of life on earth? And why are alien robots so hellbent on impersonating our automobiles?";
  var raw_array = words.split(" ");
  var word_array_tmp = {};

  // Calculate counts for each number
  $(raw_array).each(function(index,value) {
    // make sure we remove punctuations
    $(punct_marks).each(function(index, punct) {
      //var re = new RegExp(punct, 'g');
      //TODO: make this a replace all
      value = value.replace(punct,"");
    });

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
      if (!boring_words[key.toLowerCase()] && !extra_boring_words[key.toLowerCase()]) {
  		word_array.push({text: key, weight: word_array_tmp[key]});
  	}
  }
  return word_array;
}

