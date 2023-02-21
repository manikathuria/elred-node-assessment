const mailer = require('@sendgrid/mail');
const path = require("path")

require("dotenv").config({ path: path.resolve(__dirname, "../.env") })

mailer.setApiKey(process.env.SENDGRID_API_KEY);

const userCostants = require("../modules/user/constant")
const ab = require('../')

module.exports = async (userObject, type,token=null) => {
  let html = `<strong>error in send email</strong>`
  let subject = "error in send email";

  if (type === "user_otp_verification")  {
    subject =   `Verify your email`
    html = `Your OTP is <b>${token} </b>. It will expire in 1 hour.`
  }
  if(type === "user_forgot_password"){
    subject = 'Verify your email'
    html = `Your OTP is <b> ${token} </b>. It will expire in 1 hour.`
  }

  const email = {
    to: userObject.email,
    from: process.env.EMAIL_FROM,
    subject,
    html,
  }

  try {
    await mailer.send(email);
    return ('Email successfully sended')
  } catch(error) {
    console.log(error)
    console.log(error.response.body)
    throw error
  }
}
