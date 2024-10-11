import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
   private transporter;

   constructor() {
      this.transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: 'kaiserlaconfiture@gmail.com',
            pass: 'rsfw vdlo amfj aqjx',
         },
      });
   }

   async sendPasswordResetEmail(
      emailTo: string,
      resetLink: string,
   ): Promise<void> {
      const mailOptions = {
         from: 'Caenar <kaiserlaconfiture@gmail.com>',
         to: emailTo,
         subject: 'Reset your Marites account password',
         text: 'Someone (hopefully you) has requested a password reset for your Marites account. Follow the link below to set a new password before the link expires in 15 minutes:',
         html: `
            <div style="text-align: center; width: 500px; margin: 0 auto;">
               <img src="cid:skibiditoiletimage" style="width: 150px;" />
               <br /><br />
               <p>Someone (hopefully you) has requested a password reset for your Marites account. Follow the link below to set a new password before the link expires in 15 minutes:</p>
               <br /><br />
               <a href="${resetLink}" target="_blank">${resetLink}</a>
               <br /><br />
               <p>If you don't wish to reset your password, disregard this email and no action will be taken.</p>
               <p>Dr. AMMC</p>
            </div>
         `,
         attachments: [
            {
               filename: 'logo.png',
               path: 'src/mail/logo.png',
               cid: 'skibiditoiletimage',
            },
         ],
      };
      try {
         const info = await this.transporter.sendMail(mailOptions);
         console.log('Email sent: ' + info.response);
      } catch (error) {
         console.error('Error sending email:', error);
      }
   }
}
