module.exports = (err, req, res, next) => {
    res.status(500).json({error : err.message})
}

module.exports = (req, res, next) => {
    res.status(404).json({ msg: 'Resource not found' })
}