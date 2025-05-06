const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Gmail account credentials
const senderEmail = "mega.team.hr@gmail.com";
const senderPassword = "hklp fvzb fgpc wvji";

// Email content
const htmlContent = `
<html>

<body>
    <p><img src="cid:panner" alt="MEGFAIR"></p>

    <p>We hope this message finds you well.</p>

    <p>We are writing to inform you that the <strong>dates</strong> for <strong style="color: red;">MEGFAIR</strong>
        <strong>been updated due to circumstances beyond our control.</strong>
    </p>

    <p><strong>The New Event Dates:</strong><br>
        <strong>Saturday, May 10th</strong> & <strong>Sunday, May 11th</strong><br>
        <strong>Location:</strong> ITI, Mansoura University
    </p>

    <p>We sincerely apologize for any inconvenience this change may cause and appreciate your understanding.</p>

    <p>A detailed confirmation email with full event information and resources will follow soon.</p>

    <p>Thank you for your continued interest, and we look forward to seeing you at <strong
            style="color: red;">MEGFAIR</strong></p>

    <p>Best regards,<br>
        MEGA Team HR<br>
        MEGA Team</p>
</body>

</html>
`;
const imagePath = "images/MEGFAIR.jpg";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: senderEmail,
    pass: senderPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// send email in batches
async function sendEmails(userEmails) {
  const batchSize = 70;
  const waitTime = 30 * 60 * 1000; // 30 minutes in milliseconds

  for (let i = 0; i < userEmails.length; i += batchSize) {
    const batch = userEmails.slice(i, i + batchSize);

    for (let email of batch) {
      const mailOptions = {
        from: senderEmail,
        to: email,
        subject: "MEGFAIR Event Update",
        html: htmlContent,
        attachments: [
          {
            filename: "MEGFAIR.jpg",
            path: imagePath,
            cid: "panner", // same cid value as in the html img src
          },
        ],
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
      } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
      }
    }

    // Wait only if there are more emails to send
    if (i + batchSize < userEmails.length) {
      console.log(
        `Waiting for ${
          waitTime / 1000
        } seconds before sending the next batch...`
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  console.log("All emails sent successfully!");
}

const userEmails = ["my112233ff@gmail.com"];

sendEmails(userEmails);
