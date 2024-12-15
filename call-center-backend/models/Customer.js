const mongoose=require('mongoose')
const CustomerSchema = new mongoose.Schema({
    name:String,
    age:Number,
    email:String,
    phone:String,
    address:String,
    agentUsername:String
});
module.exports = mongoose.model('Customer',CustomerSchema);