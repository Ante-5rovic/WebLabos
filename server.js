const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;
const { closePool } = require('./api');
const {config} = require('./middleware/auth0midle')
const { auth } = require('express-openid-connect');




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());

app.use(auth(config));

app.get('/lol', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
  console.log("Error path hit, rendering template...");
    //500 Error
    res.status(500);
    if (req.accepts("html")) {
      //res.sendFile(path.join(__dirname, 'views','500.html'))
      res.render("500");
    } else if (req.accepts("json")) {
      res.json({ message: "500 Greška!" });
    } else {
      res.type("txt").send("500 Greška!");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGINT', () => {
  console.log('SIGINT primljen. Zatvaranje pool-a...');
  closePool();
  server.close(() => {
    console.log("Server zatvoren.");
    process.exit();
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM primljen. Zatvaranje pool-a...');
  closePool();
  server.close(() => {
    console.log("Server zatvoren.");
    process.exit();
  });
});