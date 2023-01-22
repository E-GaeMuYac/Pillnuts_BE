const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authUser.middleware');

const AllergyController = require('../architecture/controllers/allergies.controller');
const allergyController = new AllergyController();

router.get('/search', authMiddleware, allergyController.findAllMaterials);
router.get('/user', authMiddleware, allergyController.userAllergy);

module.exports = router;
