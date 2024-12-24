const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email, subject, message) => {
    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: subject,
        text: message,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent to', email);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;
