import { deleteDoc, getAll, getDocWithId, insertDoc } from "./Database";

export const addEvent = async (creatorId, newEventData) => {
  console.log(newEventData);
  const newEvent = { ...newEventData, creatorId };
  const eventDoc = await insertDoc("events", newEvent);
  console.log(newEvent);
  return eventDoc;
};

export const getAllEvents = async () => {
  const events = await getAll("events");
  console.log("Events Services:", events);
  return events;
};

export const editEvent = async (userId, eventId, newEventData) => {
  const eventDoc = await getDocWithId("events", eventId);
  if (eventDoc.creatorId !== userId) {
    throw new Error("unauthorized");
  }
  const newEventDoc = { ...eventDoc, ...newEventData };

  console.log(newEventDoc);
  const result = await insertDoc("events", newEventDoc);
  return result;
};

export const deleteEvent = async (userId, eventId) => {
  const eventDoc = await getDocWithId("events", eventId);
  if (eventDoc.creatorId !== userId) {
    throw new Error("unauthorized");
  }
  const result = await deleteDoc("events", eventId);
  return result;
};
