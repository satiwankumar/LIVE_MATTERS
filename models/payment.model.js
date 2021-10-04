const mongoose = require("mongoose");
const PaymentsSchema = new mongoose.Schema({


    user:{
        firstname:{type:String,default : null},
        lastname:{type:String,default : null},
        email:{type:String,default : null},
        city:{type:String,default : null},
        zip_code:{type:String,default : null}


    },
    charge_id: {
        type: String
    },
    payload: {
        type: String
    },
    amount: {
        type: String
    },
    status: {
        type: String

    },
    type: {
        type: String
    },
    method:{
        type:String
        
    }
});

PaymentsSchema.set('timestamps', true)

module.exports = Payments = mongoose.model("Payments", PaymentsSchema)