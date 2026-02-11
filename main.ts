#! /usr/bin/env node
import { dirname, join } from "path";
import { appOptions } from "./app.constants.ts";
import { AppService, Database } from "./app.service.ts";
import { fileURLToPath } from "url";

async function main(): Promise<void> {
  const userArguments = process.argv.slice(2);

  //If user dont pass arguments
  if (userArguments.length < 1) {
    console.log("Welcome to To Do CLI, you can do --help for see the commands");
    return;
  }

  // Help seccion
  if (userArguments.includes("--help")) {
    console.log("Here is the list with all commands in the app");
    for (let index = 0; index < appOptions.length; index++) {
      const element = appOptions[index];
      if (element) {
        const options = element.options
          ? element.options
              .map((e) => "\n\n\t\t" + e.name + "\t" + e.description + "\n")
              .join("")
          : "\n\n";
        console.log(element.name + "\n\t" + element.description + options);
      }
    }
    return;
  }

  const db = await Database.create(
    join(dirname(fileURLToPath(import.meta.url)), "data.json"),
  );

  const appServiceClass = AppService.create(userArguments.slice(1), db);
  // Controller of options
  switch (userArguments[0]) {
    case "add":
      await appServiceClass.add();
      break;
    case "update":
      await appServiceClass.update();
      break;
    case "delete":
      await appServiceClass.delete();
      break;
    case "mark-in-progress":
      await appServiceClass.markInProgress();
      break;
    case "mark-done":
      await appServiceClass.markDone();
      break;
    case "list":
      await appServiceClass.list();
      break;
    default:
      console.log("Not valid parameter");
      break;
  }
}

main();
