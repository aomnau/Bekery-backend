const router = require("../routes/auth-route")

module.exports.register = (req,res,next) => {
    res.send('in Register...')
}

module.exports.login = (req,res,next) => {
    res.send('in Login...')
}
