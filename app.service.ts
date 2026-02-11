import { writeFile, readFile, access, constants } from "node:fs/promises";
import type { IDatabase } from "./app.interfaces.ts";
import { appOptions } from "./app.constants.ts";

// To manage database/file with data for read/write data
export class Database {
  private database: string;
  private defaultDatabase: IDatabase = { task: [], nextID: 1 };
  /**
   * init
   */
  private async init() {
    try {
      await access(this.database, constants.F_OK);
    } catch (error) {
      await writeFile(
        this.database,
        JSON.stringify(this.defaultDatabase),
        "utf-8",
      );
    }
  }

  private constructor(database: string) {
    this.database = database;
  }

  public static async create(filename: string) {
    const db = new Database(filename);
    await db.init();
    return db;
  }

  /**
   * get
   */
  public async get({
    // id,
    status,
  }: {
    // id?: number;
    status?: "done" | "todo" | "in-progress";
  } = {}): Promise<IDatabase> {
    try {
      const file = await readFile(`${this.database}`, { encoding: "utf-8" });
      const json: IDatabase = JSON.parse(file.trim());

      //   if (id) {
      //     json.task = json.task.filter((t) => t.id === id);
      //   }
      if (status) {
        json.task = json.task.filter((t) => t.status === status);
      }

      return json;
    } catch {
      return this.defaultDatabase;
    }
  }

  /**
   * write
   */
  public async write(data: IDatabase): Promise<void> {
    try {
      await writeFile(this.database, JSON.stringify(data), "utf-8");
      return;
    } catch (error) {
      console.log("Cant write in file", error);
      return;
    }
  }
}

export class AppService {
  private userParams: string[];
  private db: Database;

  private constructor(userParams: string[], db: Database) {
    this.userParams = userParams;
    this.db = db;
  }

  public static create(userParams: string[], db: Database) {
    const appServiceInstance = new AppService(userParams, db);
    return appServiceInstance;
  }
  /**
   * add
   */
  public async add() {
    const newTask = this.userParams[0];
    if (!newTask) {
      console.log(
        `${appOptions[0].name}\t EXAMPLE USE: ${appOptions[0].description}`,
      );
      return;
    }
    console.log(`ADDING TASK: ${newTask}`);
    const dbData = await this.db.get();
    dbData.task.push({
      id: dbData.nextID,
      description: newTask,
      status: "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    dbData.nextID = ++dbData.nextID;
    await this.db.write(dbData);
    return;
  }
  /**
   * update
   */
  public async update() {
    const taskID = +this.userParams[0];
    const newTaskDescription = this.userParams[1];
    if (!taskID || Number.isNaN(taskID) || !newTaskDescription) {
      console.log(
        `${appOptions[1].name}\t EXAMPLE USE: ${appOptions[1].description}`,
      );
      return;
    }
    const dbData = await this.db.get();
    const findTaskIndex = dbData.task.findIndex((t) => t.id === taskID);
    if (findTaskIndex === -1) {
      console.log("This ID Task dont exist");
      return;
    }
    const lastTaskDescription = dbData.task[findTaskIndex].description;

    dbData.task[findTaskIndex].description = newTaskDescription;
    dbData.task[findTaskIndex].updatedAt = new Date().toISOString();

    await this.db.write(dbData);
    console.log(
      `Task ${taskID} ${lastTaskDescription} -> ${newTaskDescription}`,
    );
    return;
  }
  /**
   * delete
   */
  public async delete() {
    const taskID = +this.userParams[0];
    if (!taskID || Number.isNaN(taskID)) {
      console.log(
        `${appOptions[2].name}\t EXAMPLE USE: ${appOptions[2].description}`,
      );
      return;
    }
    const dbData = await this.db.get();
    const findTaskIndex = dbData.task.findIndex((t) => t.id === taskID);
    if (findTaskIndex === -1) {
      console.log("This ID Task dont exist");
      return;
    }

    console.log(
      `Task ${taskID} -> ${dbData.task[findTaskIndex].description} | ${dbData.task[findTaskIndex].status}\t REMOVED`,
    );
    dbData.task = dbData.task.filter((t) => t.id !== taskID);
    await this.db.write(dbData);
    return;
  }
  /**
   * markInProgress
   */
  public async markInProgress() {
    const taskID = +this.userParams[0];
    if (!taskID || Number.isNaN(taskID)) {
      console.log(
        `${appOptions[3].name}\t EXAMPLE USE: ${appOptions[3].description}`,
      );
      return;
    }
    const dbData = await this.db.get();
    const findTaskIndex = dbData.task.findIndex((t) => t.id === taskID);
    if (findTaskIndex === -1) {
      console.log("This ID Task dont exist");
      return;
    }

    dbData.task[findTaskIndex].status = "in-progress";
    dbData.task[findTaskIndex].updatedAt = new Date().toISOString();
    await this.db.write(dbData);
    console.log(
      `Task ${taskID} -> ${dbData.task[findTaskIndex].description} CHANGE STATE`,
    );
  }

  /**
   * markDone
   */
  public async markDone() {
    const taskID = +this.userParams[0];
    if (!taskID || Number.isNaN(taskID)) {
      console.log(
        `${appOptions[3].name}\t EXAMPLE USE: ${appOptions[3].description}`,
      );
      return;
    }
    const dbData = await this.db.get();
    const findTaskIndex = dbData.task.findIndex((t) => t.id === taskID);
    if (findTaskIndex === -1) {
      console.log("This ID Task dont exist");
      return;
    }

    dbData.task[findTaskIndex].status = "done";
    dbData.task[findTaskIndex].updatedAt = new Date().toISOString();
    await this.db.write(dbData);
    console.log(
      `Task ${taskID} -> ${dbData.task[findTaskIndex].description} CHANGE STATE`,
    );
  }

  /**
   * list
   */
  public async list() {
    const filter = this.userParams[0];
    let dbData: IDatabase;
    console.log("ID\tDESCRIPTION\tSTATE\n");
    if (
      filter &&
      (filter === "todo" || filter === "in-progress" || filter === "done")
    ) {
      dbData = await this.db.get({ status: filter });
    } else {
      dbData = await this.db.get();
    }
    for (let i = 0; i < dbData.task.length; i++) {
      const t = dbData.task[i];
      console.log(`${t.id}\t${t.description}\t${t.status}`);
    }
  }
}
