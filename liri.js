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

fs.writeFile("./random.txt", userInput, err => {
  if (err) {
    console.error(err);
    return;
  }
});

fs.readFile("./random.txt", "utf-8", function(err, data) {
  if (err) {
    return console.log(err);
  }
  //   console.log(data);
  dataArr = data.split(",");
  command = dataArr[0];
  content = dataArr[1];
  //   console.log(command);
  //   console.log(content);
  concertQueryUrl =
    "https://rest.bandsintown.com/artists/" +
    content +
    "/events?app_id=codingbootcamp";

  switch (command) {
    case "concert-this":
      axios
        .get(concertQueryUrl)
        .then(function(response) {
          //   console.log(response);
          //   console.log(response.data[0].venue);
          //   console.log(response.data[0].venue.name);
          let concertResponse =
            "Venue Name: " +
            response.data[0].venue.name +
            "\nCountry: " +
            response.data[0].venue.country +
            "\nCity: " +
            response.data[0].venue.city +
            "\nEvent Time: " +
            moment(response.data[0].datetime).format("DD/MM/YYYY");
          console.log(concertResponse);
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
          })
          .catch(function(err) {
            console.log(err);
          });
      } else {
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
                "\n";

              console.log(spotifyDisplayResult);
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }
  }
});
