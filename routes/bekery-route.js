const express = require('express')
const router = express.Router()
const bekerydata = require('../controllers/bakery-data')
const upload = require('../middlewares/upload')

router.post('/bekery-name', upload.single("image_bekery"), bekerydata.bekery)
router.get('/showbekery', bekerydata.showbekery)

module.exports = router