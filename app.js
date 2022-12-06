const express = require("express");
const https = require("https");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home", {});
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  if (query) {
  const appKey = "e4422009931f61bb98a657c15008370c";
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    appKey +
    "&units=" +
    unit;
  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      if (weatherData.main !== undefined) {
      const temp = weatherData.main.temp;
      // const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.render("result", {
        cityName: query,
        temperature: temp,
        weatherIcon: iconURL
       });
    } else {
      res.render("error", {errorText: "City not found: check if the city name was correct."})
    }
  });
  });
} else {
  res.render("error", {errorText: "City not found: no city name entered."})
}
});

app.listen(PORT, function () {
  console.log("Server is running on port 3000.");
});
