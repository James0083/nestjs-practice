import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

//4.3.3 회원가입 이메일 발송
@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'jaewon.you@dnsevercorp.com', //'YOUR_GMAIL',
        pass: 'cokj mtje hpdj rfry', //'YOUR_PASSWORD',
      },
    });
  }

  // eslint-disable-next-line prettier/prettier
  async sendMemberJoinVerification(emailAddress: string, signupVerifyToken: string) {
    const baseUrl = 'http://localhost:3030';

    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
            가입확인 버튼을 누르시면 가입 인증이 완료됩니다.<br/>
            <form action="${url}" method="POST">
                <button>가입확인</button>
            </form>
          `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
