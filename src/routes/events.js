import { Router } from "express";
import { authVaildator } from "../services/auth";
import {
  addEvent,
  getAllEvents,
  editEvent,
  deleteEvent,
} from "../services/events";

const router = Router();

router.post("/", authVaildator, async (req, res) => {
  if (req.user.type === "Admin") {
    console.log(req.body);
    const id = req.user._id;
    const { newEvent } = req.body;
    try {
      await addEvent(id, newEvent);
      console.log("Added event", newEvent);
      res.send({ success: true, event: newEvent });
    } catch (err) {
      res.status(500).send({ sucess: false, message: err.message });
    }
  } else {
    res.send({ success: false, error: "Not Admin" });
  }
});

router.put("/:eventId", authVaildator, async (req, res) => {
  if (req.user.type === "Admin") {
    const { event } = req.body;
    const { eventId } = req.params;
    try {
      const result = await editEvent(req.user._id, eventId, event);
      res.send({ success: true, result });
    } catch (err) {
      if (err.message === "unauthorized") {
        res.status(401).send({ success: false, message: "not the owner" });
      } else if (err.error === "not_found") {
        res.status(404).send({ success: false, message: "event not found" });
      } else {
        res.status(500).send({ success: false, message: err.message });
      }
    }
  }
});

router.delete("/:eventId", authVaildator, async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await deleteEvent(req.user._id, eventId);
    res.send({ success: true, result });
  } catch (err) {
    if (err.message === "unauthorized") {
      res.status(401).send({ success: false, message: "not the owner" });
    } else if (err.error === "not_found") {
      res.status(404).send({ success: false, message: "event not found" });
    } else {
      res.status(500).send({ success: false, message: err.message });
    }
  }
});

router.get("/", async (req, res) => {
  const events = await getAllEvents();
  res.send({ success: true, events });
});

export default router;
