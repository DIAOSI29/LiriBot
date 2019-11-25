require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var input1 = process.argv[2];
var input2 = process.argv.slice(3).join(" ");
var userInput = input1 + "," + input2;
var command;
var content;
var concertQueryUrl;

if (input1 != "do-what-it-says") {
  fs.writeFile("./random.txt", userInput, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

fs.readFile("./random.txt", "utf-8", function(err, data) {
  if (err) {
    return console.log(err);
  }

  dataArr = data.split(",");
  command = dataArr[0];
  content = dataArr[1];

  let eachLogInput = "NEW COMMAND: " + userInput + "\n" + "\n";
  fs.appendFile("./log.txt", eachLogInput, err => {
    if (err) throw err;
  });

  switch (command) {
    case "concert-this":
      console.log("Upcoming events for " + content.toUpperCase() + ":" + "\n");
      fs.appendFile(
        "./log.txt",
        "Upcoming events for " + content.toUpperCase() + ":" + "\n" + "\n",
        err => {
          if (err) throw err;
        }
      );
      concertQueryUrl =
        "https://rest.bandsintown.com/artists/" +
        content +
        "/events?app_id=codingbootcamp";
      axios
        .get(concertQueryUrl)
        .then(function(response) {
          for (let i = 0; i < response.data.length; i++) {
            let concertResponse =
              "Venue Name: " +
              response.data[i].venue.name +
              "\nCountry: " +
              response.data[i].venue.country +
              "\nCity: " +
              response.data[i].venue.city +
              "\nEvent Time: " +
              moment(response.data[i].datetime).format("DD/MM/YYYY") +
              "\n";
            console.log(concertResponse);
            fs.appendFile("./log.txt", concertResponse + "\n", err => {
              if (err) throw err;
            });
          }
        })
        .catch(function(error) {
          if (error.response) {
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
          } else if (error.request) {
          } else {
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
      break;

    case "spotify-this-song":
      if (content == "") {
        spotify
          .search({
            type: "track",
            query: "ace of base",
            limit: 1
          })
          .then(function(response) {
            console.log(
              "Artist's Name: " +
                response.tracks.items[0].artists[0].name +
                "\nSong's Name: " +
                response.tracks.items[0].name +
                "\nPreview Link: " +
                response.tracks.items[0].external_urls.spotify +
                "\nAlbum: " +
                response.tracks.items[0].album.name +
                "\n"
            );
            fs.appendFile(
              "./log.txt",
              "Default Result: " +
                "\n" +
                "\nArtist's Name: " +
                response.tracks.items[0].artists[0].name +
                "\nSong's Name: " +
                response.tracks.items[0].name +
                "\nPreview Link: " +
                response.tracks.items[0].external_urls.spotify +
                "\nAlbum: " +
                response.tracks.items[0].album.name +
                "\n" +
                "\n",
              err => {
                if (err) throw err;
              }
            );
          })
          .catch(function(err) {
            console.log(err);
          });
      } else {
        console.log("\nSpotify data for " + content.toUpperCase() + ":" + "\n");
        fs.appendFile(
          "./log.txt",
          "Spotify data for " + content.toUpperCase() + ":" + "\n" + "\n",
          err => {
            if (err) throw err;
          }
        );
        spotify
          .search({ type: "track", query: content, limit: 5 })
          .then(function(response) {
            for (let i = 0; i < response.tracks.items.length; i++) {
              let eachSearch = response.tracks.items[i];
              // console.log(response.tracks.items[i]);
              let spotifyDisplayResult =
                "Artist's Name: " +
                eachSearch.artists[0].name +
                "\nSong's Name: " +
                eachSearch.name +
                "\nPreview Link: " +
                eachSearch.external_urls.spotify +
                "\nAlbum: " +
                eachSearch.album.name +
                "\n" +
                "\n";

              console.log(spotifyDisplayResult);
              fs.appendFile("./log.txt", spotifyDisplayResult, err => {
                if (err) throw err;
              });
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }
      break;

    case "movie-this":
      if (content != "") {
        console.log("\nMovie data for " + content.toUpperCase() + ":" + "\n");
        fs.appendFile(
          "./log.txt",
          "Movie data for " + content.toUpperCase() + ":" + "\n" + "\n",
          err => {
            if (err) throw err;
          }
        );
        axios
          .get("http://www.omdbapi.com/?t=" + content + "&apikey=trilogy")
          .then(function(response) {
            let eachSearch = response.data;
            let movieDisplayResult =
              "Movie Tile: " +
              eachSearch.Title +
              "\nYear: " +
              eachSearch.Year +
              "\nIMDB Rating: " +
              eachSearch.imdbRating +
              "\nRotten Tomatos Rating: " +
              eachSearch.Ratings[1].Value +
              "\nCountry: " +
              eachSearch.Country +
              "\nLanguage: " +
              eachSearch.Language +
              "\nPlot: " +
              eachSearch.Plot +
              "\nActors: " +
              eachSearch.Actors +
              "\n";
            //   console.log(eachSearch.Ratings);
            console.log(movieDisplayResult);
            fs.appendFile("./log.txt", movieDisplayResult + "\n", err => {
              if (err) throw err;
            });
          })
          .catch(function(error) {
            if (error.response) {
              console.log("---------------Data---------------");
              console.log(error.response.data);
              console.log("---------------Status---------------");
              console.log(error.response.status);
              console.log("---------------Status---------------");
              console.log(error.response.headers);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
            console.log(error.config);
          });
      } else {
        axios
          .get("http://www.omdbapi.com/?t=Mr.Nobody&apikey=trilogy")
          .then(function(response) {
            let eachSearch = response.data;
            let defaultMovieResult =
              "Default Result: " +
              "\n" +
              "\nMovie Tile: " +
              eachSearch.Title +
              "\nYear: " +
              eachSearch.Year +
              "\nIMDB Rating: " +
              eachSearch.imdbRating +
              "\nRotten Tomatos Rating: " +
              eachSearch.Ratings[1].Value +
              "\nCountry: " +
              eachSearch.Country +
              "\nLanguage: " +
              eachSearch.Language +
              "\nPlot: " +
              eachSearch.Plot +
              "\nActors: " +
              eachSearch.Actors +
              "\n";

            console.log(defaultMovieResult);
            fs.appendFile("./log.txt", defaultMovieResult + "\n", err => {
              if (err) throw err;
            });
          })
          .catch(function(error) {
            if (error.response) {
              console.log("---------------Data---------------");
              console.log(error.response.data);
              console.log("---------------Status---------------");
              console.log(error.response.status);
              console.log("---------------Status---------------");
              console.log(error.response.headers);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            }
            console.log(error.config);
          });
      }
      break;
  }
});
