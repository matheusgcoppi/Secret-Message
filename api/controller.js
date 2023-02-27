const { PrismaClient } = require("@prisma/client")
const bcrypt = require('bcrypt')

const prisma = new PrismaClient();

module.exports = {
    async createUser(req, res) {
        try {
            const {
                name
            } = req.body

            

            const user = await prisma.UserInfo.create({
                data: {
                    name                      
                }
            });

            const realPin = user.pin
            const realPinTwo = user.pintwo
            

            const newPin = await prisma.UserInfo.update({
                where: {
                    pin: realPin
                },
                data: {
                    pin: realPin.slice(0,5),
                    pintwo: realPinTwo.slice(0,6).replace(/\D/g, '')
                }
            }) 

            console.log(newPin.pin, newPin.pintwo)

            
            const salt = await bcrypt.genSalt()
            
            const hash = await bcrypt.hash(newPin.pintwo, salt)   

            const pinEncrypted = await prisma.UserInfo.update({
                where: {
                    pin: newPin.pin
                },
                data: {  
                    pintwo: hash
                }
            }) 
 
            return res.send({"sucess" : pinEncrypted})

        } catch(error) {
            console.log(error)
        }
    },
    async login(req, res) {
        try {
   
           const { pin, pintwo } = req.body

           const user = await prisma.userInfo.findUnique({
            where: {
                pin 
                }
           })
           console.log("aqui")

           if(user) {
                const match = await bcrypt.compare(pintwo, user.pintwo)
                console.log(match)
                if(match) {
                    return res.send({"sucess": "true"})
                }
                else {
                    return res.send({"sucess": "not matched"})
                }
           } else {
            return res.send({"user": "not found"})
           }
           
        }
        catch(error) {
            console.log(error)
        }

    }
}