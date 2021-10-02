
const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
   
    firstname:{
        type: String,
        required: true,
    },
    
    lastname:{
        type: String,
        required: true,
    },
    phone_no :{
        type:String,
        default:null
    },
    email:{
        type: String,
        required: true,
    },

    subject:{
        type: String,
        default:null,
        required: true,
    },
    message: {
        type: String,
        required: true
    }

});
contactSchema.set('timestamps',true)









module.exports=  Contact = mongoose.model('Contact', contactSchema);
