const mongoose = require('mongoose');
const project  = require('./project.model')
const user  = require('./User.model')


const requestSchema = new mongoose.Schema({
  
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: project
    },
    partner_type:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default :"PENDING"
    },
    reject_reason:{
        type:String,
        default:null
    },
    description:{
        type:String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: user
    }

});

requestSchema.set('timestamps',true)




module.exports=  request = mongoose.model('request', requestSchema);
