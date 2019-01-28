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

const generateDefaultSlots = slots => {
  let defaultSlots = {};
  slots.forEach(s => {
    defaultSlots[s] = { isAvailable: true };
  });
  return defaultSlots;
};

const booking = [];

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
    found = { date: dateReq, slots: generateDefaultSlots(slots) };
    booking.push(found);
  }
  return found;
};

const isDateValid = date => {
  return datefns.isPast(date) === false && datefns.isSunday(date) === false;
};

const notValidDateresponse = res => {
  return sendError(res, "Provided date is in the past or a sunday!", 400);
};

app.get("/visites", (req, res) => {
  let date = req.query.date;
  console.log(`GET request on /visites on date ${date}...`);
  if (isDateValid(date) === false) {
    return notValidDateresponse(res);
  }
  res.json(checkAvailabilities(date));
});

// Book a slot
app.post("/visites", (req, res) => {
  console.log("POST request to book a slotReceived availabilities request");
  const on = req.body.date;
  if (isDateValid(on) === false) {
    return notValidDateResponse(res);
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
  var milliseconds = new Date().getTime();
  onDate.slots[atSlot] = { isAvailable: false, name: who, key: milliseconds };
  res.json({ message: "Successfuly booked", key: milliseconds });
});

app.get("/visites/cancel", (req, res) => {
  console.log("GET cancel request on visites...");
  let key = Number(req.query.key);
  console.log(`Cancel slot with key is ${key}`);
  for (let i = 0; i < booking.length; i++) {
    for (let [slot, avail] of Object.entries(booking[i].slots)) {
      if (avail.key === key) {
        let info = `The booking done on the ${booking[i].date} at ${slot} by ${
          avail.name
        } is now cancelled.`;
        booking[i].slots[slot] = { isAvailable: true };
        console.log(info);
        return res.json({
          message: info
        });
      }
    }
  }
  res.json({
    message: "Key not found, the slot is not cancelled!"
  });
});

app.all("*", function(req, res) {
  sendError(res, "Page not found!", 404);
});

app.listen(3000, () => {
  console.log(
    ">-(*)-(*)-(*)-(*)- Exo Doctoliv server started... -(*)-(*)-(*)-(*)-<"
  );
});

/*

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

app.get("/visites/cancel", (req, res) => {
  console.log("GET cancel request on visites...");
  let key = Number(req.query.key);
  console.log(`Cancel slot with key is ${key}`);
  for (let i = 0; i < booking.length; i++) {
    let slotKeys = Object.keys(booking[i].slots);
    for (let j = 0; j < slotKeys.length; j++) {
      let slotKey = booking[i].slots[slotKeys[j]].key;
      if (slotKey && slotKey === key) {
        console.log("Slot found: ", booking[i].slots[slotKeys[j]]);
        booking[i].slots[slotKeys[j]] = { isAvailable: true };
        return res.json({
          message: "Visit is cancelled."
        });
      }
    }
  }
  res.json({
    message: "Key not found, the slot is not cancelled!"
  });
});

*/
