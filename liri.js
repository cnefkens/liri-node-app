var request=require('request');
var fs=require('fs');
// var inquirer=require('inquirer');
var twitter=require('twitter');
var spotify=require('spotify');
var keys = require("./keys.js");

var liriCommand = process.argv[2].toLowerCase();
var liriParams="";
var randomCommand="";
// console.log("liriParams: " + liriParams);
// console.log("process.argv[3]: " + process.argv[3]);

if (process.argv[3] !== undefined && process.argv[3]) {
    liriParams=process.argv[3];
}

if (process.argv.length>4) {
    for (i=4;i<process.argv.length;i++) {
        liriParams += "+" + process.argv[i];
        // console.log(liriParams);
        }
    };


// console.log(liriCommand);
//  console.log("liriParams after eval: " + liriParams);

runLiriCommand();

function runLiriCommand() {
     logLiriCommand();
    
    switch (liriCommand) {
      case "my-tweets":
      
          myTweets();
          break;
      case "movie-this":
            movieThis();
            break;
      case "spotify-this-song":
           
           spotifyThisSong();
           break;
      case "do-what-it-says":
            doWhatItSays();
            break;
         };
}

function spotifyThisSong () {
    if (liriParams == "") {
              liriParams="The Sign";
            }
    //    console.log("liriParams: " + liriParams);

       spotify.search({ type: 'track', query: liriParams }, function(err, data) {
                 if ( err ) {
                    console.log('Error occurred: ' + err);
                    fs.appendFile("log.txt","Error occurred: " + console.log(err));
                    return;
                    }
            
                else {
                // console.log(data);
                // console.log(JSON.stringify(data,null,2)); 

                    for (i=0;i<data.tracks.items.length;i++) {
                        console.log("Artist: " + data.tracks.items[i].album.artists[0].name); 
                        console.log("Song name: " + data.tracks.items[i].name);
                        console.log("Preview link: " + data.tracks.items[i].preview_url);
                        console.log("Album: " + data.tracks.items[i].album.name); 
                        console.log("");
                        fs.appendFile("log.txt","Artist: " + data.tracks.items[i].album.artists[0].name + "\r\n"); 
                        fs.appendFile("log.txt","Song name: " + data.tracks.items[i].name + "\r\n");
                        fs.appendFile("log.txt","Preview link: " + data.tracks.items[i].preview_url + "\r\n");
                        fs.appendFile("log.txt","Album: " + data.tracks.items[i].album.name + "\r\n"); 
                        fs.appendFile("log.txt","" + "\r\n");
                        }
                    }
            });
}

function movieThis() {
            var omdbKey = keys.omdbKey.api_key;
            if (liriParams == "") {
                liriParams="Mr+Nobody";
                }
              
        var queryUrl = "http://www.omdbapi.com/?apikey=" + omdbKey + "&t=" + liriParams + "&y=&plot=short&r=json";
        
        // console.log(omdbKey);
        // console.log(queryUrl);

        request(queryUrl,function(error, response, body) {
                    if (!error && response.statusCode ===200) {
                    //    console.log(body);
                        // console.log(JSON.stringify(body,null,2));
                        if (JSON.parse(body).Title === undefined) {
                             console.log("No match for movie title")
                             fs.appendFile("log.txt","Title: " + JSON.parse(body).Title  + "\r\n");
                        }
                        else {
                            console.log("Title: " + JSON.parse(body).Title);
                            console.log("Year: " + JSON.parse(body).Year);
                            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                            console.log("Country: " + JSON.parse(body).Country);
                            console.log("Language: " + JSON.parse(body).Language);
                            console.log("Plot: " + JSON.parse(body).Plot);
                            console.log("Actors: " + JSON.parse(body).Actors);
                            console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
                            fs.appendFile("log.txt","Title: " + JSON.parse(body).Title  + "\r\n");
                            fs.appendFile("log.txt","Year: " + JSON.parse(body).Year + "\r\n");
                            fs.appendFile("log.txt","IMDB Rating: " + JSON.parse(body).imdbRating + "\r\n");
                            fs.appendFile("log.txt","Country: " + JSON.parse(body).Country + "\r\n");
                            fs.appendFile("log.txt","Language: " + JSON.parse(body).Language + "\r\n");
                            fs.appendFile("log.txt","Plot: " + JSON.parse(body).Plot + "\r\n");
                            fs.appendFile("log.txt","Actors: " + JSON.parse(body).Actors + "\r\n");
                            fs.appendFile("log.txt","Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value + "\r\n");
                            }
                        }
                    else {
                        fs.appendFile("log.txt","Error occurred: " + console.log(error));
                        }
                    }
                );
}

function myTweets() {
    var myTweets = new twitter({consumer_key: keys.twitterKeys.consumer_key,
            consumer_secret: keys.twitterKeys.consumer_secret,
            access_token_key: keys.twitterKeys.access_token_key,
            access_token_secret: keys.twitterKeys.access_token_secret});

        var twitterParams = {screen_name: 'lb_lemur'};

            myTweets.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {
        
                        if (!error) {
                            // console.log(tweets);
                            
                             for (i=0;i<tweets.length;i++) {
                                 var tweetNo=tweets.length - i
                                console.log("Tweet " + tweetNo + " text: " + tweets[i].text);
                                console.log("Tweet " + tweetNo + " create dtm: " + tweets[i].created_at);
                                fs.appendFile("log.txt","Tweet " + tweetNo + " text: " + tweets[i].text + "\r\n");
                                fs.appendFile("log.txt","Tweet " + tweetNo + " create dtm: " + tweets[i].created_at + "\r\n");
                                }
                            }
                         else {
                             fs.appendFile("log.txt","Error occurred: " + console.log(error));
                         }   
                        });
            }

function doWhatItSays() {
     fs.readFile("random.txt","utf8",function(err,data) {
                if (err) {
                    console.log(err);
                    fs.appendFile("log.txt", console.log(err));
                }
                else {
                    var arrRandom=data.split(",");
                    logLiriCommand();
                    
                    liriCommand=arrRandom[0];
                    liriParams=arrRandom[1];
                    
                    runLiriCommand();
                }   
            });

}

function logLiriCommand() {
    if (randomCommand != "") {
        fs.appendFile("log.txt","Liri Command: " + liriCommand + "\r\n");
        fs.appendFile("log.txt","Liri Random Command:" + randomCommand + " " + liriParams.replace('+',' ') + "\r\n");
    }
    else {
         fs.appendFile("log.txt","Liri Command: " + liriCommand + " " + liriParams.replace('+',' ') + "\r\n");
    }

}