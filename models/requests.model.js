const mongoose = require('mongoose');
const project  = require('./project.model')
const user  = require('./User.model')


const requestSchema = new mongoose.Schema({
  
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project'
        
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
        type:String,
        default:null

    },
    first_name : {
        type:String,
        default:null

        
    },
   
    

    lastname : {
        type:String,
        default:null

        
    },
    email:{
        type:String,
        default:null

    },
    gender:{
        type:String,
        default:null

    },
    occupation:{
            type:String,
        default:null

        },
    phone_no:{
            type:String,
        default:null

        },
    message : {
            type:String,
        default:null

        },
   
   
    // user:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: user
    // }

});

requestSchema.set('timestamps',true)




module.exports=  request = mongoose.model('request', requestSchema);
