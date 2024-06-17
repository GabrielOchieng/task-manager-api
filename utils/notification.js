// import { getUpcomingTasks } from "../controllers/taskController";

// async function sendUpcomingTaskNotifications() {
//   const upcomingTasks = await getUpcomingTasks(7); // Fetch tasks due in next 7 days
//   // ... Logic to process tasks and send email notifications for each upcoming task
// }

// export default sendUpcomingTaskNotifications;
import { getUpcomingTasks } from "../controllers/taskController.js";
import { sendTaskReminder } from "./email.js";

export const sendUpcomingTaskNotifications = async () => {
  const upcomingTasks = await getUpcomingTasks(7); // Fetch tasks due in next 7 days

  for (const task of upcomingTasks) {
    const assignedUser = task.assignedTo.name || task.assignedTo.email; // Get assigned user name or email

    try {
      await sendTaskReminder(assignedUser, task.title);
      console.log(`Sent email notification for task: ${task.title}`);
    } catch (error) {
      console.error(
        `Error sending email notification for task: ${task.title}`,
        error
      );
    }
  }
};
