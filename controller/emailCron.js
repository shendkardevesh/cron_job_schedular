let EmailCronModel = require('../model/emailCron');
const nodemailer = require('nodemailer');

module.exports.save = function(data) {
  return new Promise(function(resolve, reject) {
    let dataToBeSaved = {
      date: data,
      description: `cron job record for ${data.getHours()}`
    }
    console.log(dataToBeSaved);
    let saveData = new EmailCronModel(dataToBeSaved);
    saveData.save()
      .then(response => {
        console.log(response);
        return resolve(response);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

module.exports.sendEmail = async function(date) {
  try {
    let todayDate = new Date();
    todayDate.setHours(0);
    todayDate.setMinutes(0);
    console.log(todayDate);
    let emails = await EmailCronModel.find({
      'date': {
        '$gte': todayDate,
        '$lte': new Date()
      }
    });
    console.log(emails);

    let transporter = nodemailer.createTransport({
      service: "gmail", // "smtp.gmail.com",
      // port: 25,
      // secure: false, // true for 465, false for other ports
      auth: {
        user: 'shendkardevesh91@gmail.com', // generated ethereal user
        pass: '' // generated ethereal password
      },
      // tls: {
      //   rejectUnauthorized: false
      // }
    });
    let infos = [];
    for (i = 0; i < emails.length; i++) {
      let info = await transporter.sendMail({
        from: 'Devesh<shendkardevesh91@gmail.com>', // sender address
        to: "deveshendkar@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: emails[i].description, // plain text body
        html: "<b>"+ emails[i].description +"</b>"
      });
      console.log(info);
      infos.push(info);
    }
    
    return infos;
  } catch(err) {
    return err;
  }
};