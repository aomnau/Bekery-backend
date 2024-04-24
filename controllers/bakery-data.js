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

exports.addProductToCart = async (req, res, next) => {
    try {
        const { bekery_id, product_id, quantity } = req.body;
        const user = req.user  // สมมติว่าข้อมูลผู้ใช้ถูกเก็บไว้ใน req.user

        if (!user || !bekery_id || !product_id || !quantity) {
            return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        if (isNaN(parseInt(user.user_id)) || isNaN(parseInt(bekery_id)) || isNaN(parseInt(product_id)) || isNaN(parseInt(quantity))) {
            return res.status(400).json({ error: 'ข้อมูลไม่ถูกต้อง' });
        }

        const product = await db.product.findUnique({
            where: { product_id: parseInt(product_id) }
        });

        if (!product) {
            return res.status(404).json({ error: 'ไม่พบสินค้าที่ต้องการเพิ่มในตะกร้า' });
        }

        const cartItem = await db.cart.create({
            data: {
                user_id: parseInt(user.user_id),
                bekery_id: parseInt(bekery_id),
                product_id: parseInt(product_id),
                quantity: parseInt(quantity)
            }
        });

        res.json({ msg: 'เพิ่มสินค้าในตะกร้าเรียบร้อยแล้ว', result: cartItem });
    } catch (err) {
        next(err);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const { cartItemId } = req.params;
        const user = req.user;

        if (!user || !cartItemId) {
            return res.status(400).json({ error: 'ข้อมูลไม่ถูกต้อง' });
        }

        const cartItem = await db.cart.findUnique({
            where: { cart_id: parseInt(cartItemId) },
            include: {
                user: true
            }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'ไม่พบรายการในตะกร้า' });
        }

        if (cartItem.user.user_id !== user.user_id) {
            return res.status(403).json({ error: 'คุณไม่มีสิทธิ์ในการลบรายการนี้' });
        }

        await db.cart.delete({
            where: { cart_id: parseInt(cartItemId) }
        });

        res.json({ msg: 'ลบรายการในตะกร้าเรียบร้อยแล้ว' });
    } catch (err) {
        next(err);
    }
};

exports.addAddress = async (req, res, next) => {
    try {
        const { addressline1, addressline2, city } = req.body;
        const user = req.user;  // สมมติว่าข้อมูลผู้ใช้ถูกเก็บไว้ใน req.user

        if (!user) {
            return res.status(401).json({ error: 'ไม่พบข้อมูลผู้ใช้' });
        }

        const newAddress = await db.address.create({
            data: {
                user_id: user.user_id,
                addressline1,
                addressline2,
                city
            }
        });

        res.json({ msg: 'บันทึกที่อยู่เรียบร้อยแล้ว', result: newAddress });
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
                product: true,
                cart: true
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

exports.showbekeryaddress = async (req, res, next) => {
    try {
        
        const user_id = req.user_id; 

        const showaddress = await db.address.findMany({
            where: {
                user_id: user_id
            }
        });
        if (showaddress.length === 0) {
            return res.status(404).json({ message: "Address not found for this user." });
        }
         res.status(200).json(showaddress );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

exports.showbekerycart= async (req, res, next) => {
    try {
        const user_id = req.user;

        const cartItems = await db.cart.findMany({
            where: {
                user_id: user_id.user_id
            },
            include: {
                product: {
                    include: {
                        bekery: true 
                    }
                }
            }
        });

        res.json(cartItems);
    } catch (err) {
        next(err);
    }
}

exports.createOrderDetail = async (req, res, next) => {
    try {
        const { product_id, quantity } = req.body;

        // Validate input
        if (!product_id || !quantity) {
            return res.status(400).json({ error: 'Please provide product ID and quantity' });
        }

        // Assuming user ID is obtained from req.user
        const user_id = req.user.user_id;

        // Create the order detail
        const orderDetail = await db.orderDetail.create({
            data: {
                product_id: parseInt(product_id),
                quantity: parseInt(quantity)
            }
        });

        res.json({ msg: 'Order detail created successfully', result: orderDetail });
    } catch (err) {
        next(err);
    }
};

exports.showOrderDetail = async (req, res, next) => {
    try {
        const orderDetails = await db.orderDetail.findMany({
            include: {
                product: true // Include product details
            }
        });

        res.json(orderDetails);
    } catch (err) {
        next(err);
    }
};

exports.createOrder = async (req, res, next) => {
    try {
        const { bekery_id, totalamount } = req.body;
        const user = req.user;
  
        if ( !bekery_id || !totalamount) {
            return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }


        const order = await db.order.create({
            data: {
                user_id: user.user_id,
                bekery_id: parseInt(bekery_id),
                totalamount: parseFloat(totalamount)
            }
        });

        res.json({ msg: 'สร้างคำสั่งซื้อเรียบร้อยแล้ว', result: order });
    } catch (err) {
        next(err);
    }
};

exports.createPayment = async (req, res, next) => {
    try {
        const { order_id, paymentmethod } = req.body;

        // Validate input
        if (!order_id || !paymentmethod) {
            return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Create the payment
        const payment = await db.payment.create({
            data: {
                order_id: parseInt(order_id),
                paymentmethod
            }
        });

        res.json({ msg: 'บันทึกข้อมูลการชำระเงินเรียบร้อยแล้ว', result: payment });
    } catch (err) {
        next(err);
    }
};

exports.showOrder = async (req, res, next) => {
    try {
        const { user_id } = req.user;

        // Validate input
        if (!user_id) {
            return res.status(400).json({ error: 'ไม่พบผู้ใช้' });
        }

        // Get orders by user ID
        const orders = await db.order.findMany({
            where: { user_id: parseInt(user_id) },
            include: {
                bekery: true, // Include bekery details in the response
                payment: true // Include payment details in the response
            }
        });

        res.json({ orders });
    } catch (err) {
        next(err);
    }
};