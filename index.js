const express = require("express");
const datefns = require("date-fns");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

slots = [
  "1000",
  "1030",
  "1100",
  "1130",
  "1400",
  "1430",
  "1500",
  "1530",
  "1600",
  "1630",
  "1700",
  "1730"
];

const defaultSlots = {
  "1000": { isAvailable: true },
  "1030": { isAvailable: true },
  "1100": { isAvailable: true },
  "1130": { isAvailable: true },
  "1400": { isAvailable: true },
  "1430": { isAvailable: true },
  "1500": { isAvailable: true },
  "1530": { isAvailable: true },
  "1600": { isAvailable: true },
  "1630": { isAvailable: true },
  "1700": { isAvailable: true },
  "1730": { isAvailable: true }
};

const booking = [
  {
    date: "2019-01-31",
    slots: {
      "1000": { isAvailable: true },
      "1030": { isAvailable: true },
      "1100": { isAvailable: true },
      "1130": { isAvailable: true },
      "1400": { isAvailable: true },
      "1430": { isAvailable: true },
      "1500": { isAvailable: true },
      "1530": { isAvailable: true },
      "1600": { isAvailable: true },
      "1630": { isAvailable: true },
      "1700": { isAvailable: true },
      "1730": { isAvailable: true }
    }
  },
  {
    date: "2019-02-01",
    slots: {
      "1000": { isAvailable: true },
      "1030": { isAvailable: true },
      "1100": { isAvailable: true },
      "1130": { isAvailable: true },
      "1400": { isAvailable: true },
      "1430": { isAvailable: true },
      "1500": { isAvailable: false, name: "John" },
      "1530": { isAvailable: true },
      "1600": { isAvailable: true },
      "1630": { isAvailable: true },
      "1700": { isAvailable: true },
      "1730": { isAvailable: true }
    }
  }
];

const sendError = (res, info, statusCode) => {
  const errMessage = `Bad request: ${info}`;
  return res.status(statusCode).json({
    error: {
      message: errMessage
    }
  });
};

const checkAvailabilities = dateReq => {
  let found = booking.find(elt => elt.date === dateReq);
  if (found === undefined) {
    found = { date: dateReq, slots: defaultSlots };
    booking.push(found);
  }
  return found;
};

app.get("/visites", (req, res) => {
  console.log("GET request on visites...");
  let date = req.query.date;
  if (datefns.isPast(date) === true) {
    return sendError(res, "Provided date is in the past!", 400);
  }

  res.json(checkAvailabilities(date));
});

// Book a slot
app.post("/visites", (req, res) => {
  console.log("POST request to book a slotReceived availabilities request");
  const on = req.body.date;
  if (datefns.isPast(on) === true) {
    return sendError(res, "Provided date is in the past!", 400);
  }
  const atSlot = req.body.slot;
  if (slots.includes(atSlot) === false) {
    return sendError(res, "Provided slot is not valid!", 400);
  }
  const who = req.body.name;
  if (!who) {
    return sendError(res, "Provided name is not valid!", 400);
  }
  let onDate = checkAvailabilities(on);
  if (onDate.slots[atSlot].isAvailable === false) {
    return sendError(res, "Slot already booked!", 400);
  }
  onDate.slots[atSlot] = { isAvailable: false, name: who };
  res.json({ message: "Successfuly booked" });
});

// Gérer les pages introuvables
app.all("*", function(req, res) {
  sendError(res, "Page not found!", 404);
});

app.listen(3000, () => {
  console.log("**********************************");
  console.log("* Exo Doctoliv server started... *");
  console.log("**********************************");
});
