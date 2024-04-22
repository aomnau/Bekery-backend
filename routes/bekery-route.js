const express = require('express')
const router = express.Router()
const bekerydata = require('../controllers/bakery-data')
const authenticate = require('../middlewares/authenticate')
const upload = require('../middlewares/upload')

router.post('/bekery-name', upload.single("imagebekery"), bekerydata.bekery)
router.get('/showbekery', bekerydata.showbekery)
router.get('/showproduct/:id', bekerydata.showbekeryproduct)
router.post('/addProduct', bekerydata.addProduct)
router.post('/addtocart', authenticate,bekerydata.addProductToCart)
router.post('/addAddress', authenticate, bekerydata.addAddress)
router.get('/showaddress',bekerydata.showbekeryaddress)
router.get('/showcart',authenticate, bekerydata.showbekerycart)





module.exports = router