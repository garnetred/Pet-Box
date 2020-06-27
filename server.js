const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.set("port", process.env.PORT || 3000);
app.locals.title = "Pet Box";
app.locals.pets = [
  { id: "a1", name: "Rover", type: "dog" },
  { id: "b2", name: "Marcus Aurelius", type: "parakeet" },
  { id: "c3", name: "Craisins", type: "cat" },
];

app.get("/", (request, response) => {
  response.send("/index.html");
});

app.post("/api/v1/pets", (request, response) => {
  const id = Date.now();
  const pet = request.body;

  for (let requiredParameter of ["name", "type"]) {
    if (!pet[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
  }
  const { name, type } = pet;
  app.locals.pets.push({ id, name, type });
  response.status(201).json({ id, name, type });
});

app.patch("/api/v1/pets/:id", (request, response) => {
  const pet = request.body;
  const { id } = request.params;
  const foundPet = app.locals.pets.find((animal) => animal.id === id);
  if (!foundPet) {
    return response.status(404);
  }
  pet.name ? (foundPet.name = pet.name) : null;

  pet.type ? (foundPet.type = pet.type) : null;

  const { name, type } = pet;

  response.status(201).json({ id, name, type });
});

app.get("/api/v1/pets", (request, response) => {
  const pets = app.locals.pets;

  response.json({ pets });
});

app.delete("/api/v1/pets/:id", (request, response) => {
  const { id } = request.params;
  const pet = app.locals.pets.find((animal) => animal.id === id);
  const foundPet = app.locals.pets.findIndex((animal) => animal.id === id);
  app.locals.pets.splice(foundPet, 1);
  console.log(app.locals.pets);

  response.send(`${pet.name} is gone.`);
});

app.get("/api/v1/pets/:id", (request, response) => {
  const pets = app.locals.pets;

  const { id } = request.params;
  const pet = pets.find((pet) => pet.id === id);

  if (!pet) {
    return response.sendStatus(404);
  }

  response.status(200).json(pet);
});

app.listen(app.get("port"), () => {
  console.log(
    `${app.locals.title} is running on http://localhost:${app.get("port")}.`
  );
});
