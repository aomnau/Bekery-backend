const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const db = require("../models/db");

exports.register = async (req, res, next) => {
        const { firstName, lastName, username, password, confirmPassword, email, phone } = req.body;
        try {
        if (!(firstName && lastName && email && phone && username && password && confirmPassword)) {
            return next(new Error('Fulfill all inputs'));
        }
        if (confirmPassword !== password) {
            throw new Error('confirm password ont match');
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        const data = {
                firstName,
                lastName,
                username,
                password : hashedPassword,
                email,
                phone
            };
        
        const rs = await db.user.create({ data })
        console.log(rs)

        res.json({msg: 'Register successful'})
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const {username, password} = req.body
    try {
  
      if( !(username.trim() && password.trim()) ) {
        throw new Error('username or password must not blank')
      }
 
      const user = await db.user.findFirstOrThrow({ where : { username }})

      const pwOk = await bcrypt.compare(password, user.password)
      if(!pwOk) {
        throw new Error('invalid login')
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      console.log(token)
      res.json({token : token})
    }catch(err) {
      next(err)
    }
  };

exports.getme = async (req, res, next) => { 
      res.json(req.user);
  };