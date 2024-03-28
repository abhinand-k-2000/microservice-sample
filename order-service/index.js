const express = require('express')
const app = express();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const amqp = require('amqplib')
const Order = require('./order')
const isAuthenticated = require('../isAuthenticated')


app.use(express.json())

var channel, connection;
 
const PORT = process.env.PORT3 || 3003;
mongoose.connect('mongodb://localhost/order-service')
    .then(() => console.log(`order-service DB connect`))

async function createOrder(products, userEmail){
    let total = 0;
    products.forEach((item) =>{
        total += item.price
    })
    const order = new Order({
        products,
        user: userEmail,
        total_price: total
    })
    const orderData = await order.save();  
    return orderData;
}

async function connect(){
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);  
    channel = await connection.createChannel();
    await channel.assertQueue("ORDER") 
}
connect().then( () =>{
    channel.consume("ORDER", async (data) => {
        console.log("consuming order queue");
        const {products, userEmail} = JSON.parse(data.content)
        const newOrder = await createOrder(products, userEmail)
        console.log("new order: ", newOrder)
        channel.ack(data)
        channel.sendToQueue("PRODUCT", Buffer.from(JSON.stringify({newOrder})))
        })
 
    }) 




app.listen(PORT, ()=> console.log(`order-service running at port http://localhost:${PORT}`))
