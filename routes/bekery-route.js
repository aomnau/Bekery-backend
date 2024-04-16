const express = require('express')
const router = express.Router()
const bekerydata = require('../controllers/bakery-data')
const upload = require('../middlewares/upload')

router.post('/bekery-name', upload.single("imagebekery"), bekerydata.bekery)
router.get('/showbekery', bekerydata.showbekery)
router.get('/showproduct/:id', bekerydata.showbekeryproduct)
router.post('/addProduct', bekerydata.addProduct)
router.post('/addAddress', bekerydata.addAddress)

module.exports = router