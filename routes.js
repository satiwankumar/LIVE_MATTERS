//importing api's
const express = require('express')
const Users = require('./routes/usersRoute')
const Auth  = require('./routes/authRoute')
const Contact  = require('./routes/contactRoute')
const Blogs  = require('./routes/blogRoute')
const Notification = require('./routes/notifications')
const Projects = require('./routes/projectRoute')
const Requests = require('./routes/requestRoute')


// const Dashboard = require('./routes/dashboardRoute')



module.exports = function(app){
//look for dependency
//Middlware
app.use(express.json())

app.use('/api/users',Users)
app.use('/api/auth',Auth)
app.use('/api/contact',Contact)
// app.use('/api/dashboard',Dashboard)
app.use('/api/notifications',Notification)
app.use('/api/blogs',Blogs)
app.use('/api/projects',Projects)
app.use('/api/requests',Requests)




// app.use(error)


}