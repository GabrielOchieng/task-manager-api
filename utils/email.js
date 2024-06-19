// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // Use true for port 465 (recommended for Gmail)
//   auth: {
//     user: "ogingagabriel@gmail.com",
//     pass: process.env.MAIL_PASSWORD,
//   },
// });

// // async..await is not allowed in global scope, must use a wrapper
// export const sendTaskReminder = async (recipientName, taskName) => {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"TASKY " <ogingagabriel@gmail.com>', // sender address
//     to: "thegabrielshow2@gmail.com", // Personalize recipient address
//     subject: "Reminder: Task Deadline Approaching", // More specific subject
//     text: `Hey, \nA friendly reminder that your task is due soon.`,
//     html: `<b>
//     Reminder: Hey, \nA friendly reminder that your task is due soon.
//     </b>`, // Update html body
//   });

//   console.log("Message sent: %s", info.messageId);
// };

// // Example usage
// const recipientName = "John Doe";
// const taskName = "Important Report";

// sendTaskReminder(recipientName, taskName);
