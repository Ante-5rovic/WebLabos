const { Pool } = require("pg");
const dotenv = require("dotenv");
const axios = require('axios');

dotenv.config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST_EXT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: true,
});

async function addBuyer(vatin, firstName, lastName) {
  try {
    await pool.query(
      `INSERT INTO buyers (vatin, firstName, lastName) VALUES ('${vatin}', '${firstName}', '${lastName}');`
    );
    console.log("Buyer added to DB");
  } catch (err) {
    console.error("Error acured while adding buyer to DB: " + err);
  }
}

async function addTicket(vatin) {
  try {
    const result = await pool.query(
      'INSERT INTO tickets (vatin) VALUES ($1) RETURNING ticket_id;',
      [vatin]
    )
    const ticketId = result.rows[0].ticket_id;
    console.log("Ticket added to DB");
    return ticketId;
  } catch (err) {
    console.error("Error acured while adding ticket to DB: " + err);
    return "error";
  }
}

async function isArlediyRegistred(vatin) {
  var result = false;
  try {
    result = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM buyers WHERE vatin = '${vatin}');`
    );
    result = result.rows[0].exists;
    result ? console.log("Buyer is alredy in DB") :  console.log("Buyer needs to be added");
  } catch (err) {
    result = false;
    console.error("Error aucred while trying to find user in DB: " + err);
  } finally {
    return result;
  }
}

async function countTickets(vatin) {
  var count = 0;
  try {
    count = await pool.query(
      `SELECT COUNT(*) FROM tickets WHERE vatin = '${vatin}';`
    );
    count=count.rows[0].count
    console.log("Ticket sucesfuly counted");
  } catch (err) {
    count = 0;
    console.error("Error acured while trying to count tickets: " + err);
  } finally {
    return count;
  }
}

async function getTicketInfo(ticketId) {
  try {
   
    const result = await pool.query(
      'SELECT vatin, createdAt FROM tickets WHERE ticket_id = $1;',
      [ticketId]
    );

    if (result.rows.length === 0) {
      console.log("Ticket not found.");
      return null;
    }

    const ticketInfo = result.rows[0];
    console.log("Ticket info:", ticketInfo);
    return ticketInfo;
  } catch (err) {
    console.error("Error fetching ticket info: " + err);
    return null;
  }
}

async function getBuyerInfo(vatin) {
  try {
    const result = await pool.query(
      'SELECT firstName, lastName FROM buyers WHERE vatin = $1;',
      [vatin]
    );

    if (result.rows.length === 0) {
      console.log("Buyer not found.");
      return null;
    }

    const { firstname, lastname } = result.rows[0];
    const buyerInfo = {
      firstName: firstname,
      lastName: lastname,
    };

    console.log("Buyer info:", buyerInfo);
    return buyerInfo;
  } catch (err) {
    console.error("Error fetching buyer info: " + err);
    throw err;
  }
}



async function countAllTickets() {
  var count = 0;
  try {
    count = await pool.query(
      `SELECT COUNT(*) FROM tickets`
    );
    count=count.rows[0].count
    console.log("Ticket sucesfuly counted");
  } catch (err) {
    count = 0;
    console.error("Error acured while trying to count tickets: " + err);
  } finally {
    return count;
  }
}

async function closePool() {
  try {
    await pool.end();
    console.log("Pool has been closed");
  } catch (err) {
    console.error("Error closing the pool: " + err);
  }
}




module.exports = { closePool,countTickets,addBuyer,addTicket,isArlediyRegistred,countAllTickets,getTicketInfo,getBuyerInfo };
