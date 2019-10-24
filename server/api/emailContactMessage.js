const nodemailer = require('nodemailer');

const emailContactMessage = (messageObj) => {

    console.log(process.env.GSUITE_CLIENT_ID)
    console.log(process.env.GSUITE_PRIVATE_KEY)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'william@appagetech.com',
            serviceClient: process.env.GSUITE_CLIENT_ID,
            privateKey: process.env.GSUITE_PRIVATE_KEY,
        }
    });

    const mailResponse = transporter.sendMail({
        from: 'william@appagetech.com',
        to: 'preston@appagetech.com, william@appagetech.com',
        subject: messageObj.subject,
        html: messageObj.html
    })
        .catch(error => console.error(error));
    return mailResponse

}

module.exports = { emailContactMessage };