const db = require('../models/db')
const {Status} = require('@prisma/client')

exports.getByUser = async (req, res, next) => {
  try {
    const todos = await db.todo.findMany({
      where : { user_id : req.user.user_id}
    })
    res.json({todos})
  } catch (err) {
    next(err)
  }
}

exports.createTodo = async (req, res, next) => {
  const data = req.body
  try{
    const rs = await db.todo.create({
       data : { ...data, user_id : req.user.user_id}
    })
    res.json({ msg: 'Create OK' , result : rs })
  }catch(err) {
    next(err)
  }
}

exports.updateTodo = async (req, res, next) => {
  const {id} = req.params
  const data = req.body
  try {
    const rs = await db.todo.update({
      data :  {...data},
      where: { id : +id , user_id : req.user.user_id} 
    })
    res.json({msg: 'Update ok', result: rs})
  }catch(err){
    next(err)
  }
}

exports.deleteTodo = async (req, res, next) => {
  const {id} = req.params
  try {
    const rs = await db.todo.delete({ where : {id : +id, user_id: req.user.user_id}})
    res.json({msg: 'Delete ok', result : rs})
  }catch(err) {
    next(err)
  }
}

exports.getAllStatus = async (req, res, next) => {
  res.json({status: Object.values(Status)})
}

exports.createOrder = async (req, res, next) => {
  try {
      const { user_id, bekery_id, totalamount } = req.body;

      // Validate input
      if (!user_id || !bekery_id || !totalamount) {
          return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
      }

      // Create the order
      const order = await db.order.create({
          data: {
              user_id: parseInt(user_id),
              bekery_id: parseInt(bekery_id),
              totalamount: parseFloat(totalamount)
          }
      });

      res.json({ msg: 'สร้างคำสั่งซื้อเรียบร้อยแล้ว', result: order });
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