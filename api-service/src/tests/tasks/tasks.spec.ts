import { Server } from "http";

import { Sequelize } from "sequelize-typescript";
import request from "supertest";

import { app } from "../../app";
import { sequelizeConfig } from "../../configs";
import { 
  MarketModel, 
  StrategyModel, 
  TaskModel 
} from "../../models";
import { 
  ActionType, 
  Comprasion, 
  StrategyRuleType, 
  TaskStatus, 
  TaskType, 
  TimeFrameUnit 
} from "../../types";

let sequelize: Sequelize;
let application: Server;

const strategyPayload = {
  name: "test strategy",
  marketId: 1,
  assets: ["BTCTUSD"],
  isActive: true,
  taskType: TaskType.ONE_TIME,
  taskSchedule: {
    startAt: Date.now(),
    endAt:  Date.now(),
  },
  actions: [
    {
      type: ActionType.TELEGRAM_NOTIFICATION,
      payload: {}
    }
  ],
  rules: [
    {
      type: StrategyRuleType.PERCENTAGE_CHANGE,
      comparison: Comprasion.GREATER_THAN,
      value: 1,
      timeFrame: {
        amount: 1,
        unit: TimeFrameUnit.DAYS
      }
    }
  ]
};

describe("Tasks Integration Tests", () => {
  beforeAll(async () => {
    sequelize = new Sequelize({
      ...sequelizeConfig,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      logging: false,
    });

    await sequelize.sync({ force: true });
    application = app.listen(4000);
  });

  afterAll(async () => {
    await TaskModel.truncate();
    await StrategyModel.truncate();
    await MarketModel.truncate();
    await sequelize.close();
    application.close();
  });

  describe("Create task", () => {
    test("Should throw 400 exception if strategyId has invalid format.", async () => {
      await request(application)
        .post("/tasks")
        .send({ strategyId: "Invalid strategyId" })
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should throw 400 exception if strategyId is missed.", async () => {
      await request(application)
        .post("/tasks")
        .send({})
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should throw 400 exception if strategyId is invalid.", async () => {
      await request(application)
        .post("/tasks")
        .send({ strategyId: "Invalid strategyId" })
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should create running task.", async () => {
      const market = await request(application)
        .post("/markets")
        .send({ name: "Test market", url: "http://some-url.com" });
      
      strategyPayload.marketId = market.body.id;
      strategyPayload.taskSchedule.endAt = undefined;
    
      const strategy = await request(application)
        .post("/strategies")
        .send(strategyPayload);

      await request(application)
        .post("/tasks")
        .send({ strategyId: strategy.body.id })
        .expect((response) => {
          expect(response.status).toBe(201);
          expect(response.body.status).toBe(TaskStatus.RUNNING);
          expect(response.body.isActive).toBe(true);
          expect(response.body.startedAt).toStrictEqual(expect.anything());
          expect(response.body.endedAt).toBe(undefined);
        });
    });

    test("Should create completed task.", async () => {
      const market = await request(application)
        .post("/markets")
        .send({ name: "Test market", url: "http://some-url.com" });
      
      strategyPayload.marketId = market.body.id;
      strategyPayload.taskSchedule.endAt = Date.now();
    
      const strategy = await request(application)
        .post("/strategies")
        .send(strategyPayload);

      await request(application)
        .post("/tasks")
        .send({ strategyId: strategy.body.id })
        .expect((response) => {
          expect(response.status).toBe(201);
          expect(response.body.status).toBe(TaskStatus.COMPLETED);
          expect(response.body.isActive).toBe(false);
          expect(response.body.startedAt).toStrictEqual(expect.anything());
          expect(response.body.endedAt).toStrictEqual(expect.anything());
        });
    });

    test("Should create pending task.", async () => {
      const market = await request(application)
        .post("/markets")
        .send({ name: "Test market", url: "http://some-url.com" });
      
      strategyPayload.marketId = market.body.id;
      strategyPayload.taskSchedule.endAt = undefined;
      strategyPayload.taskSchedule.startAt = new Date().setFullYear(2050);
    
      const strategy = await request(application)
        .post("/strategies")
        .send(strategyPayload);

      await request(application)
        .post("/tasks")
        .send({ strategyId: strategy.body.id })
        .expect((response) => {
          expect(response.status).toBe(201);
          expect(response.body.status).toBe(TaskStatus.PENDING);
          expect(response.body.isActive).toBe(false);
          expect(response.body.startedAt).toBe(undefined);
          expect(response.body.endedAt).toBe(undefined);
        });
    });

    test("Should create default task.", async () => {
      const market = await request(application)
        .post("/markets")
        .send({ name: "Test market", url: "http://some-url.com" });
      
      strategyPayload.marketId = market.body.id;
      strategyPayload.taskSchedule.endAt = undefined;
      strategyPayload.taskSchedule.startAt = undefined;
    
      const strategy = await request(application)
        .post("/strategies")
        .send(strategyPayload);

      await request(application)
        .post("/tasks")
        .send({ strategyId: strategy.body.id })
        .expect((response) => {
          expect(response.status).toBe(201);
          expect(response.body.status).toBe(TaskStatus.RUNNING);
          expect(response.body.isActive).toBe(true);
          expect(response.body.startedAt).toStrictEqual(expect.anything());
          expect(response.body.endedAt).toBe(undefined);
        });
    });
  });

  describe("Get task by id.", () => {
    test("Should return task by id.", async () => {
      const market = await request(application)
        .post("/markets")
        .send({ name: "Test market", url: "http://some-url.com" });
      const strategy = await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, marketId: market.body.id });
      const task = await request(application)
        .post("/tasks")
        .send({ strategyId: strategy.body.id });

      await request(application)
        .get(`/tasks/${task.body.id}`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.id).toBe(task.body.id);
        });
    });
    
    test("Should throw 404 if task by id is not found.", async () => {
      await request(application)
        .get("/tasks/999")
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
  });

  describe("Delete task.", () => {
    test("Should throw 404 if trying to delete task that doesn't exist.", async () => {
      await request(application)
        .delete(`/tasks/999`)
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
  
    test("Should delete task by id.", async () => {
      const market = await request(application)
        .post("/markets")
        .send({ name: "Test market", url: "http://some-url.com" });
      const strategy = await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, marketId: market.body.id });
      const task = await request(application)
        .post("/tasks")
        .send({ strategyId: strategy.body.id });

      await request(application)
        .delete(`/tasks/${task.body.id}`)
        .expect((response) => {
          expect(response.status).toBe(204);
        });
    });
  });

  describe("Log task signal.", () => {
    test("Should throw 404 if trying to log signal for task that doesn't exist.", async () => {
      await request(application)
        .post(`/tasks/999/log`)
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
  
    test("Should log signal for task by id.", async () => {
      const market = await request(application)
        .post("/markets")
        .send({ name: "Test market", url: "http://some-url.com" });
      const strategy = await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, marketId: market.body.id });
      const task = await request(application)
        .post("/tasks")
        .send({ strategyId: strategy.body.id });

      await request(application)
        .post(`/tasks/${task.body.id}/log`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.lastSignalAt).toBeDefined();
        });
    });
  });

  describe("Run task.", () => {
    test("Should throw 404 if trying to run task that doesn't exist.", async () => {
      await request(application)
        .post(`/tasks/999/run`)
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });

    test("Should run task by id.", async () => {
      const market = await request(application)
        .post("/markets")
        .send({ name: "Test market", url: "http://some-url.com" });
      const strategy = await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, marketId: market.body.id });

      strategyPayload.taskSchedule.endAt = undefined;
      strategyPayload.taskSchedule.startAt = undefined;

      const task = await request(application)
        .post("/tasks")
        .send({ strategyId: strategy.body.id });

      await request(application)
        .post(`/tasks/${task.body.id}/run`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.startedAt).toBeDefined();
          expect(response.body.status).toBe(TaskStatus.RUNNING);
          expect(response.body.isActive).toBe(true);
        });
    });
  });

  describe("Complete task.", () => {
    test("Should throw 404 if trying to complete task that doesn't exist.", async () => {
      await request(application)
        .post(`/tasks/999/complete`)
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });

    test("Should complete task by id.", async () => {
      const market = await request(application)
        .post("/markets")
        .send({ name: "Test market", url: "http://some-url.com" });
      const strategy = await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, marketId: market.body.id });

      strategyPayload.marketId = market.body.id;
      strategyPayload.taskSchedule.endAt = undefined;

      const task = await request(application)
        .post("/tasks")
        .send({ strategyId: strategy.body.id });

      await request(application)
        .post(`/tasks/${task.body.id}/complete`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.endedAt).toBeDefined();
          expect(response.body.status).toBe(TaskStatus.COMPLETED);
          expect(response.body.isActive).toBe(false);
        });
    });
  });

  describe("Stop task.", () => {
    test("Should throw 404 if trying to stop task that doesn't exist.", async () => {
      await request(application)
        .post(`/tasks/999/stop`)
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });

    test("Should stop task by id.", async () => {
      const market = await request(application)
        .post("/markets")
        .send({ name: "Test market", url: "http://some-url.com" });
      const strategy = await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, marketId: market.body.id });

      strategyPayload.marketId = market.body.id;
      strategyPayload.taskSchedule.endAt = undefined;

      const task = await request(application)
        .post("/tasks")
        .send({ strategyId: strategy.body.id });

      await request(application)
        .post(`/tasks/${task.body.id}/stop`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.endedAt).toBeDefined();
          expect(response.body.status).toBe(TaskStatus.STOPPED);
          expect(response.body.isActive).toBe(false);
        });
    });
  });

  describe("Search tasks.", () => {
    test("Should return tasks array.", async () => {
      await request(application)
        .get(`/tasks`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
        });
    });

    test("Should throw 400 if ids query param is invalid.", async () => {
      await request(application)
        .get(`/tasks?ids=1`)
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should return tasks by ids query param.", async () => {
      await request(application)
        .get(`/tasks?ids=[1]`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          response.body.forEach((task) => expect(task.id).toBe(1));
        });
    });

    test("Should throw 400 if strategyIds query param is invalid.", async () => {
      await request(application)
        .get(`/tasks?strategyIds=1`)
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should return tasks by strategyIds query param.", async () => {
      await request(application)
        .get(`/tasks?strategyIds=[1]`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          response.body.forEach((task) => expect(task.strategyId).toBe(1));
        });
    });

    test("Should throw 400 if statuses query param is invalid.", async () => {
      await request(application)
        .get(`/tasks?statuses=["invalidStatus"]`)
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should return tasks by statuses query param.", async () => {
      await request(application)
        .get(`/tasks?statuses=["${TaskStatus.RUNNING}"]`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          response.body.forEach((task) => expect(task.status).toBe(TaskStatus.RUNNING));
        });
    });

    test("Should throw 400 if isActive query param is invalid.", async () => {
      await request(application)
        .get(`/tasks?isActive="invalidValue"`)
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should return tasks by isActive query param.", async () => {
      await request(application)
        .get(`/tasks?isActive=true`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          response.body.forEach((task) => expect(task.isActive).toBe(true));
        });
    });
  });
});
