const express = require('express');
const router = express.Router();
const authentication = require('../middlewares/authentication');
const errorHandler = require('../middlewares/errorHandler');
const uController = require('../controllers/user/userController');
const HController = require('../controllers/API/APIController');
const SRController = require('../controllers/savedRecipes/SRcontroller');
const AIController = require('../controllers/AI/AIController');
const upload = require ("../helpers/multer")



router.get('/',(req,res) => {
    res.send('ola')
})


router.post('/login',uController.login)
router.post('/google-login',uController.googleLogin)
router.post('/register',uController.register)

router.get('/recipes',HController.fetchDataHome)

router.use(authentication)

router.get('/recipes/:id', HController.getDetail);
router.post("/recipes/photo",upload.single("photo"), AIController.suggestRecipeFromPhoto);

router.post('/ai/recipes', AIController.suggestRecipe);

router.patch('/user/profile/:id',upload.single('profile') ,uController.patchImg);
router.patch('/user/name/:id',uController.patchName);
router.get('/user/:id', uController.getProfile)

router.post('/saved',SRController.create)
router.get("/saved", SRController.getdata);
router.delete("/saved/:id", SRController.delete);
router.get("/saved/:id", SRController.getDetail);

router.use(errorHandler)


module.exports = router