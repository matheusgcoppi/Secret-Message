const { PrismaClient } = require("@prisma/client")
const bcrypt = require('bcrypt')

const prisma = new PrismaClient();

module.exports = {
    async createUser(req, res) {
        try {
            const {
                name,
                pintwo
            } = req.body     

            const user = await prisma.UserInfo.create({
                data: {
                    name,
                    pintwo                      
                }
            });

            const realPin = user.pin
            const realPinTwo = user.pintwo
            

            const newPin = await prisma.UserInfo.update({
                where: {
                    pin: realPin
                },
                data: {
                    pin: realPin.slice(0,6)
                    
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
            console.log(pinEncrypted)
 
            return res.send({pinEncrypted})

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
    },
    async findUser (req, res) {
        try {
            const { pin } = req.params;
            console.log(pin)
            const user = await prisma.userInfo.findUnique({
                where: {pin: pin}
            })

        if(!user) return res.json({error: "Não foi possivel encontrar este usuário"})
            return res.json({user})

        } catch (error) {
            console.log(error)
        }
    },
    async sendText (req, res) {
        try {
            const { pin } = req.params
            const { text } = req.body
            console.log(text)

            const verifyUser = await prisma.UserInfo.findUnique({
                where: {
                    pin: pin
                }
            })
    
            if(verifyUser != null)  {
                const updatePin = verifyUser.pin;

                const createText = await prisma.Text.create({
                    data: {  
                        text: text,
                        pin: updatePin
                    }
                }) 
                res.json({createText})
            }
 
        else { 
            res.json("error") 
        }

            
        } catch (error) {
            console.log(error)
        }
    },
    async showText (req, res) {
        try {
            const { pin } = req.params

            const verifyUser = await prisma.UserInfo.findUnique({
                where: {
                    pin: pin
                }
            })

            if(verifyUser != null) {

            const realPin = verifyUser.pin
            
            const ShowText = await prisma.Text.findMany({
                where: {
                    pin: realPin
                }
            })
            res.json({"show" : ShowText})
}
           
             else {
                res.json("Does not found Text")
            }
            
        } catch (error) {
            console.log(error)
        }
    }
}