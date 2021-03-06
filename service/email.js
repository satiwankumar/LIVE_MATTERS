    const nodemailer = require('nodemailer');
    const { response } = require('express');


    const host = process.env.HOST;

    module.exports = {

        sendEmail: async function (email, code) {

            var smtpConfig = {
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: false,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD
                }
            };
            var transporter = nodemailer.createTransport(smtpConfig);
            var mailOptions = {
                from: process.env.MAIL_FROM_ADDRESS, // sender address
                to: email, // list of receivers
                subject: "Reset password link",
                text: "Some useless text",
                html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
                    \n\n Your verification code is ${code}:\n\n
                    \n\n If you did not request this, please ignore this email and your password will remain unchanged.
                    
    </p>`

            }

            // send mail with defined transport object

            let resp = await transporter.sendMail(mailOptions);
                console.log(resp)
            return true;
            // if you don't want to use this transport object anymore, uncomment following line
            //smtpTransport.close(); // shut down the connection pool, no more messages


        },
        sendContactEmail: async function (data) {
            console.log(data)
            try {
                var smtpConfig = {
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    secure: false,
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD
                    }
                };
                var transporter = nodemailer.createTransport(smtpConfig);
                var mailOptions = {
                    from: process.env.MAIL_FROM_ADDRESS, // sender address
                    to: "alllivesmatter.fr@gmail.com", // list of receivers
                    subject: data.subject,
                    text: "CONTACT US EMAIL",
                    html: `${data}`
    
                }
    
                // send mail with defined transport object
    
                let resp = await transporter.sendMail(mailOptions);
                    console.log(resp)
                return true;
                // if you don't want to use this transport object anymore, uncomment following line
                //smtpTransport.close(); // shut down the connection pool, no more messages
    
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }

           

        },
        sendRequestEmail: async function (data,type="REQUEST") {
            console.log(data)
            try {
                var smtpConfig = {
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    secure: false,
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD
                    }
                };
                var transporter = nodemailer.createTransport(smtpConfig);
                var mailOptions = {
                    from: process.env.MAIL_FROM_ADDRESS, // sender address
                    to: "alllivesmatter.fr@gmail.com", // list of receivers
                    subject: "NEW PARTNER REQUEST",
                    text: `${type="DONATION"? "NEW DONATION RECEIVED":"NEW PARTNER REQUEST"}`,
                    html: `${data}`
    
                }
    
                // send mail with defined transport object
    
                let resp = await transporter.sendMail(mailOptions);
                    console.log(resp)
                return true;
                // if you don't want to use this transport object anymore, uncomment following line
                //smtpTransport.close(); // shut down the connection pool, no more messages
    
            } catch (error) {
                console.log(error)
                throw new Error(error)
            }

           

        }
    }

    // <a href="https://${host}/login/reset/${
    //                 token
    //                 }">https://${host}/login/reset/${
    //                 token
    //                 }</a> \n\n If you did not request this, please ignore this email and your password will remain unchanged.\n