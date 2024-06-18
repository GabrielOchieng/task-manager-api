import { getUpcomingTasks } from "../controllers/taskController.js";
import { sendTaskReminder } from "./email.js";

export const sendUpcomingTaskNotifications = async () => {
  const upcomingTasks = await getUpcomingTasks(3); // Fetch tasks due in next 7 days

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
