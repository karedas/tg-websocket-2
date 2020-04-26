import express from "express";


 export const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('TGWebserver 1.0');
});

router.get('/')

