const mailHelper = require("../helper/mailHelper");

exports.sendInquiries= async (req,res)=>{
    const from = {
    address: "no-reply@goodwill-cleaning.com",
    name: "Goodwill Cleaning",
    };
    const to = [
    "info@goodwill-cleaning.com",
    ];
    const subject='Customer Inquiry';
    const html=`
        <html>
            <head>
                <style>
                h1 {
                    color: #FF0800;
                }
                p {
                    font-size: 16px;
                }
                </style>
            </head>
            <body>
                <h1>Welcome to Goodwill Cleaning!</h1>
                <p>Hehe. Heyy!! Hello!! Thanks!!</p>
                <p>Sorry for inconvenience!!</p>
            </body>
        </html>
    `;
    try {
    await mailHelper.sendEmail(from, to, subject, html);
    // res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    // res.status(500).json({ success: false, message: 'Failed to send email.' });
    console.log(error);
    
  }
}

exports.bookOrder= async (req,res)=>{
    const from = {
    address: "no-reply@goodwill-cleaning.com",
    name: "Goodwill Cleaning",
    };
    const to = [
    "info@goodwill-cleaning.com",
    ];
    const subject='Customer Order';
    const html=`
        <html>
            <head>
                <style>
                h1 {
                    color: #FF0800;
                }
                p {
                    font-size: 16px;
                }
                </style>
            </head>
            <body>
                <h1>Welcome to Goodwill Cleaning!</h1>
                <p>Hehe. Heyy!! Hello!! Thanks!!</p>
                <p>Sorry for inconvenience!!</p>
            </body>
        </html>
    `;
    try {
    await mailHelper.sendEmail(from, to, subject, html);
    // res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    // res.status(500).json({ success: false, message: 'Failed to send email.' });
    console.log(error);
    
  }
}
