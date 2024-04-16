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

exports.addProduct = async (req, res, next) => {
    try {
        const { bekery_id, productName, price } = req.body;

        if (!bekery_id || !productName || !price) {
            return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        if (isNaN(parseFloat(price))) {
            return res.status(400).json({ error: 'ราคาต้องเป็นตัวเลขที่ถูกต้อง' });
        }

        const bekery = await db.bekery.findUnique({
            where: { bekery_id: parseInt(bekery_id) }
        });

        if (!bekery) {
            return res.status(404).json({ error: 'ไม่พบข้อมูล bakery ที่เกี่ยวข้อง' });
        }

        const product = await db.product.create({
            data: {
                bekery_id: parseInt(bekery_id),
                productName,
                price: parseFloat(price)
            }
        });

        res.json({ msg: 'บันทึกข้อมูลสินค้าเรียบร้อยแล้ว', result: product });
    } catch (err) {
        next(err);
    }
};

exports.addAddress = async (req, res, next) => {
    try {
        const { user_id, addressline1, addressline2, city } = req.body;

        
        if (!user_id || !addressline1 || !city) {
            return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        
        const user = await db.user.findUnique({
            where: { id: parseInt(user_id) }
        });

        if (!user) {
            return res.status(404).json({ error: 'ไม่พบข้อมูลผู้ใช้ที่เกี่ยวข้อง' });
        }

        
        const address = await db.address.create({
            data: {
                user_id: parseInt(user_id),
                addressline1,
                addressline2,
                city
            }
        });

        res.json({ msg: 'บันทึกข้อมูลที่อยู่เรียบร้อยแล้ว', result: address });
    } catch (err) {
        next(err);
    }
};

exports.showbekery = async (req, res, next) =>{
    const showimage = await db.bekery.findMany()
    res.json(showimage)
}

exports.showbekeryproduct = async (req, res, next) => {
    const { id } = req.params;
    try {       
        const showproduct = await db.bekery.findUnique({
            where: { bekery_id: parseInt(id) },
            include: {
                product: true // รวมข้อมูลสินค้าที่เกี่ยวข้องกับร้านเบเกอรี่
            }
        });
        if (!showproduct) {
            return res.status(404).json({ message: "ไม่พบข้อมูล" });
        }
        res.json(showproduct);
    } catch (err) {
        next(err);
    }
};