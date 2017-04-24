document.body.onload = initPlayer;

var UPDATE_RATE_SECONDS = 5;
var SNIPPET_LENGTH = 1;
var DEFAULT_INITIAL_FETCH_AMOUNT = 4;
var FETCH_AMOUNT_INCREMENT = 4;

window.setInterval(playNext, SNIPPET_LENGTH * 1000); //1.25 seconds - load/play cycle
window.setInterval(performNewDefaultUpdate, UPDATE_RATE_SECONDS * 1000); //update every 10s

function performNewDefaultUpdate() {
	getNewSnippets(DEFAULT_INITIAL_FETCH_AMOUNT);
}

var snippetQ = [];

var currentSnippet = 0;
var currentChar = 0;

function initPlayer() {
	initQ();
	getNewSnippets(DEFAULT_INITIAL_FETCH_AMOUNT);
	
}

function initQ() {
	snippetQ = [{
		id: 0,
		snippet: " ",
		chars: [" "]
	}];
	currentSnippet = 0;
	currentChar = 0;
}

function playNext() {
	var char = snippetQ[currentSnippet].chars[currentChar].toLowerCase(); //var char heh
	// document.getElementById("log").innerHTML += char;
	if (char == " ") {
		char = "space";
	}
	new Audio("assets/" + char + ".wav").play();
	currentChar++;
	if (currentChar == snippetQ[currentSnippet].chars.length) {
		currentChar = 0;
		currentSnippet++;
		if (currentSnippet == snippetQ.length) {
			currentSnippet = 0;
		}
	}
}

var LOOKBACK_LENGTH_MINUTES = 2;
var minute_compen

function processSnippets(snippets) {
	snippets = JSON.parse(snippets);
	console.log(snippets);
	snippets.forEach(function(snippet) {
		var found = false;
		snippetQ.forEach(function(item) {
			if (snippet.id == item.id) { //not already set
				found = true;
			}
		});
		if (!found) {
			if (snippetQ.length >= DEFAULT_INITIAL_FETCH_AMOUNT) {
				snippetQ.shift(); //remove first item
			}
			snippet.stringN += " ";
			snippetQ.push({
				id: snippet.id,
				snippet: snippet.stringN,
				chars: snippet.stringN.split("") //explode chars
			});
			if (currentSnippet == 0) {
				currentChar == 0;
			}
		}
	});
	// document.getElementById("current").innerHTML = "";
	// snippetQ.forEach(function(snippet) {
	// 	document.getElementById("current").innerHTML += snippet.snippet + "<br>"; 
	// });
}

function httpGetAsync(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() { 
	    if (xhr.readyState == 4 && xhr.status == 200) {
	        processSnippets(xhr.responseText);
	    }
	}
    xhr.open("GET", url, true); // async
    xhr.send(null);
}

function getNewSnippets(amount) {
	httpGetAsync("http://anvil-collective.com/api/words/" + amount);
}
