import {
  getDocs,
  insertDoc,
  getDocWithId,
  deleteDoc,
  getAll,
} from "./Database";
import { getUserPets } from "./users";

const isMatch = (petA, petB) =>
  petA.lookingForMatch &&
  petA.ownerId !== petB.ownerId &&
  petA.type === petB.type &&
  petA.city === petB.city &&
  Math.abs(petA.ageMonths - petB.ageMonths) <= 3;

export const getALlPets = async (userId) => {
  const allPets = await getAll("pets");
  if (userId) {
    const userPets = await getUserPets(userId);
    allPets.forEach((p) => {
      userPets.forEach((up) => {
        if (isMatch(p, up)) {
          allPets[allPets.indexOf(p)].isMatch = true;
          allPets[allPets.indexOf(p)].matchWith = up;
        }
      });
    });
  }
  return allPets;
};

export const findPetMatches = async (petId) => {
  const targetPet = await getDocWithId("pets", petId);
  let pets = await getAll("pets");
  pets = pets.filter((p) => isMatch(p, targetPet));
  return pets;
};

export const nearbyServices = async (userCity) => {
  const nearbyService = await getDocs("pets_services", { city: userCity });
  console.log("NearbyServices:", nearbyService);
  return nearbyService;
};
export const addServices = async (serviceOwnerId, newServicesData) => {
  const newService = { ...newServicesData, serviceOwnerId };
  const result = await insertDoc("pets_services", newService);
  const serviceDoc = await getDocWithId("pets_services", result.id);
  return serviceDoc;
};
export const editServices = async (userId, serviceId, newServicesData) => {
  let serviceDoc = await getDocWithId("pets_services", serviceId);
  const newserviceDoc = { ...serviceDoc, ...newServicesData };

  const result = await insertDoc("pets_services", newserviceDoc);
  serviceDoc = await getDocWithId("pets_services", result.id);
  return serviceDoc;
};
export const deleteService = async (userId, serviceId) => {
  const serviceDoc = await getDocWithId("pets_services", serviceId);
  // Todo;
  // if (serviceDoc.ownerId !== userId) {
  //   throw new Error("unauthorized");
  // }
  const result = await deleteDoc("pets_services", serviceId);
  return result;
};

export const getAdoptionPets = async () => {
  const pets = await getAll("adoption_pets");
  return pets;
};

export const addAdoptionPet = async (petData, userId) => {
  const updatedPetdata = {
    ...petData,
    ownerId: userId,
    adopted: false,
  };
  const result = await insertDoc("adoption_pets", updatedPetdata);
  const petDoc = await getDocWithId("adoption_pets", result.id);
  return petDoc;
};

export const adoptPet = async (userId, petId) => {
  let petDoc = await getDocWithId("adoption_pets", petId);
  if (petDoc.adopted) {
    throw new Error("not-available");
  }
  petDoc.adopteeId = userId;
  petDoc.adopted = true;
  const result = await insertDoc("adoption_pets", petDoc);
  console.log(result);
  petDoc = await getDocWithId("adoption_pets", petId);
  return petDoc;
};
