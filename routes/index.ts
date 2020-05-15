import express from "express";
import newCharacter from "./newCharacter";
import randomNameGenerator from "./randomNameGenerator";

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("TGWebserver 1.0");
});

router.use("/new-character", newCharacter);
router.use("/randomname", randomNameGenerator);

export default router;
