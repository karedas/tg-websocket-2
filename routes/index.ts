import express from "express";
import newCharacter from './newCharacter';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('TGWebserver 1.0');
});

router.use('/new-character', newCharacter);

export default router;
