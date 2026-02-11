import test from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { AppService, Database } from "./app.service.ts";
import { access, constants, rm } from "node:fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const filename = join(__dirname, "test.json");

test("Check if file is created", async (t) => {
  t.after(async () => await rm(filename, { force: true }));

  await Database.create(filename);
  await assert.doesNotReject(access(filename, constants.F_OK));
});

test("Testing CLI functionabilities", async (t) => {
  //Remove file after test
  t.after(async () => await rm(filename, { force: true }));

  const dbInstance = await Database.create(filename);
  await t.test("Add Task", async () => {
    await AppService.create(["Buy groceries"], dbInstance).add();
    const dbData = await dbInstance.get();
    assert.strictEqual(dbData.task.length, 1, "Length of the data must be 1");
  });

  await t.test("Get All Tasks", async () => {
    const dbData = await dbInstance.get();
    assert.strictEqual(dbData.task.length, 1, "Length of the data must be 1");
  });

  await t.test("Update Task", async () => {
    await AppService.create(["1", "Update Buy groceries"], dbInstance).update();
    const dbData = await dbInstance.get();
    assert.strictEqual(
      dbData.task[0].description,
      "Update Buy groceries",
      "Updating task must be change the file",
    );
  });

  await t.test("Mark in progress Task", async () => {
    await AppService.create(["1"], dbInstance).markInProgress();
    const dbData = await dbInstance.get();
    assert.strictEqual(
      dbData.task[0].status,
      "in-progress",
      "Must have to change the state in task",
    );
  });

  await t.test("Get in progress Tasks", async () => {
    const dbData = await dbInstance.get({ status: "in-progress" });
    assert.strictEqual(dbData.task.length, 1, "Length of the data must be 1");
  });

  await t.test("Mark done Task", async () => {
    await AppService.create(["1"], dbInstance).markDone();
    const dbData = await dbInstance.get();
    assert.strictEqual(
      dbData.task[0].status,
      "done",
      "Must have to change the state in task",
    );
  });

  await t.test("Get done Tasks", async () => {
    const dbData = await dbInstance.get({ status: "done" });
    assert.strictEqual(dbData.task.length, 1, "Length of the data must be 1");
  });

  await t.test("Delete Task", async () => {
    await AppService.create(["1"], dbInstance).delete();
    const dbData = await dbInstance.get();
    assert.strictEqual(
      dbData.task.length,
      0,
      "Delete Task must return the length 0",
    );
  });
});
