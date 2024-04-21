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