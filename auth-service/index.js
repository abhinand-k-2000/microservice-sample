const express = require('express')
const app = express();
const mongoose = require('mongoose')
const User = require('./user');
const jwt = require('jsonwebtoken')

const PORT = process.env.PORT1 || 3001;
mongoose.connect('mongodb://localhost/auth-service')
    .then(() => console.log(`auth-service DB connect`))


app.use(express.json())

app.get('/', (req, res)=> {
    res.send("hey")
})
 
app.post('/auth/login', async(req, res)=> {
    const {email, password} = req.body; 
    const user = await User.findOne({email});
    if(!user){
        return res.json({message: "User not found!"})
    }else {
        if(password != user.password){
            return res.json({message: "Incorrect password!"})
        }

        const payload = {
            email, 
            name: user.name
        };
        jwt.sign(payload, 'secret', (err, token) => {
            if(err) console.log(err);
            else {
                return res.json({token: token})
            }
        })

    }
})

app.post('/auth/register', async(req, res)=> {
    const {name, email, password} = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.json({message: 'User already exists!'})
    } 
        const newUser = new User({
            name, 
            email,
            password
        })
   
     await newUser.save();
    return res.json(newUser)
})

app.listen(PORT, ()=> console.log(`auth-service running at port http://localhost:${PORT}`))
