import type { IAppOption } from "./app.interfaces.ts";

export const APP_CLI = "task-cli";

export const appOptions: IAppOption[] = [
  {
    name: "add",
    description:
      APP_CLI + " add [TASK] -> This is for add a new task in the program",
  },
  {
    name: "update",
    description:
      APP_CLI +
      " update [TASK_CODE] [NEW_TASK_DESCRIPTION] -> This is for update a existing task in the program",
  },
  {
    name: "delete",
    description:
      APP_CLI +
      " delete [TASK_CODE] -> This is for remove a existing task in the program",
  },
  {
    name: "mark-in-progress",
    description:
      APP_CLI +
      " mark-in-progress [TASK_CODE] -> This is for mark a existing task as is in progress",
  },
  {
    name: "mark-done",
    description:
      APP_CLI +
      " mark-done [TASK_CODE] -> This is for mark done a existing task",
  },
  {
    name: "list",
    description:
      APP_CLI +
      " list [OPTION] -> This is for list all task, you can add multiple options to filter",
    options: [
      { name: "done", description: "List all done tasks" },
      { name: "todo", description: "List all task To do" },
      { name: "in-progress", description: "List all task in progress" },
    ],
  },
];
