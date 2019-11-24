require("dotenv").config();

var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var moment = require("moment");
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
  }
});
