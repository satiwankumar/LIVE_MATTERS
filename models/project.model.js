const mongoose = require('mongoose');
const user  = require('./User.model')

const projectSchema = new mongoose.Schema({
  
    title: {
        type:String,  
        required:true   
    },
    type:{
        type:String,
        required:true  
    },
    description:{
        type:String,
        required:true   
    },
    status: {
        type:Boolean,
        default:true
    }
   

});

projectSchema.set('timestamps',true)




module.exports=  project = mongoose.model('project', projectSchema);
