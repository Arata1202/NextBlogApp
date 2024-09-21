const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  try {
    const originUrl = process.env.ORIGIN_URL;
    const emailTo = process.env.EMAIL_TO;
    const emailFrom = process.env.EMAIL_FROM;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (event.headers.origin !== originUrl) {
      return {
        statusCode: 403,
        body: JSON.stringify({ status: 'Access Forbidden' }),
      };
    }

    const postData = JSON.parse(event.body);

    if (!postData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ status: 'no data received' }),
      };
    }

    const { sei, mei, email, message } = postData;

    const mailOptions = {
      from: `"${emailFrom}" <${emailFrom}>`,
      to: `${email},${emailTo}`,
      subject: 'お問い合わせありがとうございます',
      html: `
                <p>以下の内容でお問い合わせを承りました。</p>
                <p>数日以内にご連絡いたしますので、しばらくお待ちください。</p>
                <p style='padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;'>氏名: ${sei}</p>
                <p style='padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;'>題名: ${mei}</p>
                <p style='padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;'>メールアドレス: ${email}</p>
                <p style='padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;'>お問い合わせ内容: ${message}</p>
            `,
    };

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'success', info }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'fail', error: error.message }),
    };
  }
};
