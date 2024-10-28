const express = require("express");
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const path = require("path");
const QRCode = require("qrcode");
const { checkAuth } = require("../middleware/auth0midle");
const axios = require("axios");
const {
  countTickets,
  addTicket,
  isArlediyRegistred,
  addBuyer,
  countAllTickets,
  getBuyerInfo,
  getTicketInfo,
} = require("../api");

router.get("^/$|/index(.html)?", async (req, res) => {
  res.render("index", {
    numberOfTickets: await countAllTickets(),
    QRKod: null,
  });
});

/*router.get("/ticket-form", async (req, res) => {
  res.render("addTicket", {});
});*/

router.post("/kupnja-ulaznice", checkAuth, async (req, res) => {
  const vatin = req.body.vatin;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  console.log(vatin, firstName, lastName);

  if (!vatin || !firstName || !lastName) {
    const ErrorType = "missing body arguments";
    res.status(400);
    if (req.accepts("html")) {
      return res.render("400", { ErrorType });
    } else if (req.accepts("json")) {
      return res.json({ message: `400 ${ErrorType}` });
    } else {
      return res.type("txt").send(`400 ${ErrorType}`);
    }
  }

  const maxTicketsReached = await countTickets(vatin);
  if (maxTicketsReached >= 3) {
    //<----------------- VRATI NA 3
    const ErrorType = "Already generated maximum number of tickets on this OIB";
    res.status(400);
    if (req.accepts("html")) {
      return res.render("400", { ErrorType });
    } else if (req.accepts("json")) {
      return res.json({ message: `400 ${ErrorType}` });
    } else {
      return res.type("txt").send(`400 ${ErrorType}`);
    }
  } else {
    const isRegistred = await isArlediyRegistred(vatin);
    if (!isRegistred) {
      await addBuyer(vatin, firstName, lastName);
    }

    const uuid = await addTicket(vatin);
    try {
      const qrCodeDataURL = await QRCode.toDataURL("https://weblabos1.onrender.com/ulaznica-info/" + uuid);
      res.render("index", { numberOfTickets: null, QRKod: qrCodeDataURL }); //<-- TODO dohvati dobar URL
      console.log("QR code created");
    } catch (error) {
      console.log("QR code failed: " + error);
      res.status(500).send("Error acured while trying to generate QR code");
    }
  }
});

router.get("/ulaznica-info/:id", requiresAuth(), async (req, res) => {
  const ticketId = req.params.id;
  const userData = {
    vatin: "error",
    firstName: "error",
    lastName: "error",
    timestamp: "error",
    user: "user",
  };
  try {
    const ticketInfo = await getTicketInfo(ticketId);
    userData.vatin = ticketInfo.vatin;
    userData.timestamp = ticketInfo.createdat;
    const buyerInfo = await getBuyerInfo(userData.vatin);
    userData.firstName = buyerInfo.firstName;
    userData.lastName = buyerInfo.lastName;
    userData.user = req.oidc.user;
  } catch (err) {
    console.log("Ticket with this id doesent exist: " + err);
  }
  try {
    userData.timestamp = String(userData.timestamp).split(/GMT.*/)[0].trim();
  } catch (err) {
    console.log(err);
  }

  res.render("ticket", userData);
});

router.get("/getToken", async (req, res) => {
  try {
    // Define your options for axios
    const options = {
      method: "POST",
      url: "https://dev-tor07tfe57trlp2l.us.auth0.com/oauth/token",
      data: {
        client_id: "hY8Ks55iGA8LrFPVZfUzSuTsvKKcnKIt",
        client_secret:
          "eG2VCSRDmadcz7P6h_NhuN2FoRK9Ane96lqt97e_wa1-1hziqDgwI9BXARftE_ce",
        audience: "https://dev-tor07tfe57trlp2l.us.auth0.com/api/v2/",
        grant_type: "client_credentials",
      },
    };

    const tokenResponse = await axios(options);
    const token = tokenResponse.data;

    console.log("Token received:", token);
    res.send(token); // Send token data to the client
  } catch (err) {
    console.error("Error fetching token:", err);
    res.status(500).send({ error: "Failed to fetch token" }); // Send error response to client
  }
});

module.exports = router;
