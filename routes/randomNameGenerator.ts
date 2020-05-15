import express from "express";
import { nameByRace } from "fantasy-name-generator";

const router = express.Router();

router.get("/", (_request, _response, _next) => {
  const { race, gender } = _request.query;
  if (!race) {
    _response.status(500).send({ error: "Missing Parameter" });
    return;
  }

  const transformGender = gender === "m" || !gender ? "male" : "female";
  const name = nameByRace(<string>race, {
    gender: transformGender,
    allowMultipleNames: false,
  });
  _response.status(200).send({ status: "OK", name });
});

export default router;
