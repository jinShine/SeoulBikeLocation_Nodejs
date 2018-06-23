
module.exports.findFromMail = function(data) {

    var nodemailer = require('nodemailer');
    var smtpPool = require('nodemailer-smtp-pool');
    var config = require('./config/config.json');

    var sender = '공공 자전거 앱 < seungjin429@gmail.com >';
    var receiver = data[0].email;
    var mailTitle = '찾으시는 비밀 번호입니다.';
    var html = '<h1>공공 자전거 앱</h1> <br> 회원님의 공공자전거앱 계정에 대한 비밀번호 요청을 접수했습니다. <br> 만약 회원님이 비밀번호 변경을 요청하지 않으셨다면 이 이메일을 무시하세요. <br> 회원님의 비밀번호는 <h2>'+ data[0].password +'</h2>입니다.';

    var mailOptions = {
        from: sender,
        to: receiver,
        subject: mailTitle,
        html: html
    };

    var transporter = nodemailer.createTransport(smtpPool({
        service: config.mailer.service,
        host: config.mailer.host,
        port: config.mailer.port,
        auth: {
            user: config.mailer.user,
            pass: config.mailer.password
        },
        tls: {
            rejectUnauthorize: false
        },
        maxConnections: 5,
        maxMessages: 10
    }));

    transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log('failed... => ' + err);
        } else {
            console.log('succeed... => ' + res);
        }
        transporter.close();
    });
};
