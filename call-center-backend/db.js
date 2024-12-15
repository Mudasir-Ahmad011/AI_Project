const mongoose = require('mongoose');
const mongooseURI="mongodb://localhost:27017/callcenter";
const connecttomongoose=()=>{
mongoose.connect(mongooseURI, {
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection error:', err));
}

module.exports=connecttomongoose;