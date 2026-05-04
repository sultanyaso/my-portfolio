const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON requests

let events = []; // Store events in an array

//  Home Route
app.get("/", (req, res) => {
  res.send("Event Planning App is Running!");
});

// Create an Event (POST)
app.post("/events", (req, res) => {
  const { name, description, date, time, category } = req.body;

  if (!name || !date || !time) {
    return res.status(400).json({ error: "Name, date, and time are required!" });
  }

  const newEvent = { id: events.length + 1, name, description, date, time, category };
  events.push(newEvent);

  res.status(201).json({ message: "Event created successfully!", event: newEvent });
});

//  Get All Events (GET)
app.get("/events", (req, res) => {
  res.json(events);
});

// Get an Event by ID (GET)
app.get("/events/:id", (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));

  if (!event) {
    return res.status(404).json({ error: "Event not found!" });
  }

  res.json(event);
});

// Start Server
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
