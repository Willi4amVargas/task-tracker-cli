export interface ITask {
  id?: number;
  description: string;
  status: "done" | "todo" | "in-progress";
  createdAt?: string;
  updatedAt?: string;
}

export interface IDatabase {
  task: ITask[];
  nextID: number;
}

export interface IAppOptionBase {
  name: string;
  description: string;
}

export interface IAppOption extends IAppOptionBase {
  options?: IAppOptionBase[];
}
