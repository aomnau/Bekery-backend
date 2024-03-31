const db = require('../models/db')

exports.bekery = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'ไม่มีไฟล์รูปภาพที่ส่งมา' });
        }

        const image = req.file;
        const data = req.body;

        const bekery = await db.bekery.create({
            data: {
                imagebekery: image.path,
                bekeryname: data.bekeryname,
                description: data.description
            }
            
        })
        res.json({ msg: 'บันทึกข้อมูล bakery เรียบร้อยแล้ว', result : bekery })
    } catch (err) {
        next(err)
    }
}

exports.showbekery = async (req, res, next) =>{
    const showimage = await db.bekery.findMany()
    res.json(showimage)
}

exports.showbekeryproduct = async (req, res, next) =>{
    const {id} = req.params
    try {
        
   
    const showproduct = await db.bekery.findUnique(
        {
            where : {bekery_id : parseInt(id)}
        }
    )
    res.json({showproduct})
    console.log(id)
} catch (err) {
        
}
}