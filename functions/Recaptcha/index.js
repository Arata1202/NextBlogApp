const https = require('https');
const querystring = require('querystring');

exports.handler = async (event) => {
  const allowedOrigins = ['https://realunivlog.com', 'http://localhost:3000'];

  const responseHeaders = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": allowedOrigins[0],
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  };

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: responseHeaders,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const origin = event.headers.origin || event.headers.Origin;
    if (!allowedOrigins.includes(origin)) {
      return {
        statusCode: 403,
        headers: responseHeaders,
        body: JSON.stringify({ message: 'This service is not available for your origin.' }),
      };
    }

    responseHeaders["Access-Control-Allow-Origin"] = origin;

    const body = querystring.parse(event.body);

    if (!body || !body['g-recaptcha-response']) {
      throw new Error('reCAPTCHAレスポンスが見つかりません');
    }

    const recaptchaResponse = body['g-recaptcha-response'];
    const secret = process.env.RECAPTCHA_SECRET;
    if (!secret) {
      throw new Error('reCAPTCHAシークレットが設定されていません');
    }

    const apiUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const postData = querystring.stringify({
      secret: secret,
      response: recaptchaResponse
    });

    const verifyRecaptcha = () => {
      return new Promise((resolve, reject) => {
        const req = https.request(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
          }
        }, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            if (res.statusCode === 200) {
              const responseData = JSON.parse(data);
              resolve(responseData.success);
            } else {
              reject(new Error(`reCAPTCHA検証が失敗しました。ステータスコード: ${res.statusCode}`));
            }
          });
        });

        req.on('error', (e) => {
          reject(new Error(`HTTPSリクエストエラー: ${e.message}`));
        });

        req.write(postData);
        req.end();
      });
    };

    const success = await verifyRecaptcha();

    const response = {
      success: success,
      message: success ? "reCAPTCHAが正常に検証されました" : "reCAPTCHA検証に失敗しました"
    };

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(response),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({ message: '内部サーバーエラー', error: error.message }),
    };
  }
};
