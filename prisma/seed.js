const bcrypt = require('bcryptjs')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const password = bcrypt.hashSync('123456')
const userData = [
    {username : 'aommy',  password, email: 'aommy@gmail.com'},
    {username : 'Lo',     password, email: 'Lo123@gmail.com'},
    {username : 'norman', password, email: 'norman@gmail.com'},
]

const run = async () => {
    await prisma.user.createMany({
        data : userData
    })

}

run()