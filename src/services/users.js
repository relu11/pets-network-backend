import { deleteDoc, getDocs, getDocWithId, insertDoc } from "./Database";

export const getUserPets = async (id) => {
  const pets = await getDocs("pets", { ownerId: id });
  console.log(pets);
  return pets;
};

export const addPet = async (ownerId, newPetData) => {
  const newPet = { ...newPetData, ownerId };
  const result = await insertDoc("pets", newPet);
  const petDoc = await getDocWithId("pets", result.id);
  return petDoc;
};

export const editPet = async (userId, petId, newPetData) => {
  let petDoc = await getDocWithId("pets", petId);
  if (petDoc.ownerId !== userId) {
    throw new Error("unauthorized");
  }
  const newPetDoc = { ...petDoc, ...newPetData };
  delete newPetDoc._rev;
  const result = await insertDoc("pets", newPetDoc);
  petDoc = await getDocWithId("pets", result.id);
  return petDoc;
};

export const deletePet = async (userId, petId) => {
  const petDoc = await getDocWithId("pets", petId);
  if (petDoc.ownerId !== userId) {
    throw new Error("unauthorized");
  }
  const result = await deleteDoc("pets", petId);
  return result;
};

export const getUserEvents = async (user) => {
  const eventsIds = user.attendedEvents;
  if (!eventsIds) {
    return [];
  }
  const events = await getDocs("events", { _id: { $in: eventsIds } });
  return events;
};

export const getUserAdoptedPets = async (userId) => {
  const adoptedPets = await getDocs("pets", { adopteeId: userId });
  return adoptedPets;
};
