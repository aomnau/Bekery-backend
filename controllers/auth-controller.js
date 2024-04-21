const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const db = require("../models/db");

exports.register = async (req, res, next) => {
    const { firstName, lastName, username, password, confirmPassword, email, phone } = req.body;
    try {
        if (!(firstName && lastName && email && phone && username && password && confirmPassword)) {
            return next(new Error('Please fill in all inputs'));
        }
        if (confirmPassword !== password) {
            throw new Error('Confirmed password does not match');
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        const data = {
            firstName,
            lastName,
            username,
            password: hashedPassword,
            email,
            phone
        };
        const newUser = await db.user.create({ data });
        console.log(newUser);

        const payload = { user_id: newUser.user_id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token });

    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if (!(username.trim() && password.trim())) {
            throw new Error('Username or password must not be blank');
        }

        const user = await db.user.findFirst({ where: { username } });

        if (!user) {
            throw new Error('Invalid login');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid login');
        }

        const payload = { user_id: user.user_id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
res.json({ token });
    } catch (err) {
        next(err);
    }
};


exports.getMe = async (req, res, next) => {
    try {
        res.json(req.user);
    } catch (err) {
        next(err);
    }
};

