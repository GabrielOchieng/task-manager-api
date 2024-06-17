// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // Use `true` for port 465, `false` for all other ports
//   auth: {
//     user: "ogingagabriel@gmail.com",
//     pass: process.env.MAIL_PASSWORD,
//   },
// });

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"TASKY 👻" <ogingagabriel@gmail.com>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hey Colleague, Your task is almost due. Kindly ensure that it is done before then", // plain text body
//     html: "<b>TASK DEADLINE LOOMING</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// main().catch(console.error);

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465 (recommended for Gmail)
  auth: {
    user: "ogingagabriel@gmail.com",
    pass: process.env.MAIL_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendTaskReminder(recipientName, taskName, taskLink) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"TASKY " <ogingagabriel@gmail.com>', // sender address
    to: recipientName + "@example.com", // Personalize recipient address
    subject: "Reminder: Task Deadline Approaching", // More specific subject
    text: `Hey ${recipientName}, \nA friendly reminder that your task "${taskName}" is due soon. You can find the details and complete it here: ${taskLink}`, // Personalized message with task details
    html: `<b>Reminder: Task Deadline Approaching for "${taskName}"</b>`, // Update html body
  });

  console.log("Message sent: %s", info.messageId);
}

// Example usage
const recipientName = "John Doe";
const taskName = "Important Report";
const taskLink = "https://your-app.com/tasks/123";
sendTaskReminder(recipientName, taskName, taskLink);

main().catch(console.error); // Assuming this is for error handling in your actual code
