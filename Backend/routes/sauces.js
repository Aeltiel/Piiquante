const express = require('express');
const router = express.Router();
const sauceControl = require('../controllers/sauces');
const auth = require('../midlleware/auth');
const multer = require('../midlleware/multer-config');

router.get('/', auth, sauceControl.getAllSauce);
router.get('/:id', auth, sauceControl.getOneSauce);
router.post('/', auth, multer, sauceControl.createSauce);
router.put('/:id', auth, multer, sauceControl.modifySauce);
router.delete('/:id', auth, sauceControl.deleteSauce);
router.post("/:id/like", auth ,sauceControl.likeSauce);


module.exports = router;
