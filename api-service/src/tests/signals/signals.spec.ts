import { Server } from "http";

import { Sequelize } from "sequelize-typescript";
import request from "supertest";

import { app } from "../../app";
import { sequelizeConfig } from "../../configs";
import { MarketModel, SignalModel, StrategyModel, TaskModel } from "../../models";
import { mockMarket, mockSignal, mockStrategy, mockTask } from "../fixtures";

let sequelize: Sequelize;
let application: Server;

describe("Signals Integration Tests", () => {
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
    await MarketModel.truncate();
    await StrategyModel.truncate();
    await SignalModel.truncate();
    await TaskModel.truncate();
    await sequelize.close();
    application.close();
  });

  describe("Create signal.", () => {
    test("Should throw 400 if trying to create a new signal with invalid market id.", async () => {
      await request(application)
        .post("/strategies")
        .send({ ...mockSignal(1), marketId: 999 })
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should throw 400 if trying to create a new signal with invalid task id.", async () => {
      await request(application)
        .post("/strategies")
        .send({ ...mockSignal(1), taskId: 999 })
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should throw 400 if trying to create a new signal with invalid strategy id.", async () => {
      await request(application)
        .post("/strategies")
        .send({ ...mockSignal(1), taskId: 999 })
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should create a new signal.", async () => {
      const market = await request(application)
        .post("/markets")
        .send(mockMarket(1, "test-market"));

      const strategy = await request(application)
        .post("/strategies")
        .send({ ...mockStrategy(1, "test-strategy"), marketId: market.body.id });

      const task = await request(application)
        .post("/tasks")
        .send({ ...mockTask(1, strategy.body.id), marketId: market.body.id });

      await request(application)
        .post("/signals")
        .send({ 
          ...mockSignal(1), 
          marketId: market.body.id, 
          strategyId: strategy.body.id, 
          taskId: task.body.id 
        })
        .expect((response) => {
          expect(response.status).toBe(201);
        });
    });
  });

  describe("Get signal by id.", () => {
    test("Should return signal by id.", async () => {
      await request(application)
        .get("/signals/1")
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.id).toBe(1);
        });
    });
  
    test("Should throw 404 if signal by id is not found.", async () => {
      await request(application)
        .get("/signals/999")
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
  });

  describe("Delete signal.", () => {
    test("Should throw 404 if trying to delete signal that doesn't exist.", async () => {
      await request(application)
        .delete(`/signals/999`)
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
  
    test("Should delete signal by id.", async () => {
      await request(application)
        .delete(`/signals/1`)
        .expect((response) => {
          expect(response.status).toBe(204);
        });
    });
  });

  describe("Search signals.", () => {
    test("Should throw 400 if ids param is invalid.", async () => {
      await request(application)
        .get("/signals?ids=1")
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should return signals by ids param", async () => {
      await request(application)
        .post("/signals")
        .send({ ...mockSignal(1), marketId: 1, taskId: 1, strategyId: 1 });

      await request(application)
        .get("/signals?ids=[1]")
        .expect((response) => {
          expect(response.status).toBe(200);
          response.body.forEach((signal) => expect(signal.id).toBe(1));
        });
    });

    test("Should return empty signals array by ids param", async () => {
      await request(application)
        .get("/signals?ids=[999]")
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(0);
        });
    });

    test("Should throw 400 if strategyIds param is invalid.", async () => {
      await request(application)
        .get("/signals?strategyIds=1")
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should return signals by strategyIds param", async () => {
      await request(application)
        .post("/strategies")
        .send({ ...mockStrategy(2, "test-strategy"), marketId: 1 });

      await request(application)
        .get("/signals?strategyIds=[1]")
        .expect((response) => {
          expect(response.status).toBe(200);
          response.body.forEach((signal) => expect(signal.strategyId).toBe(1));
        });
    });

    test("Should return empty signals array by strategyIds param", async () => {
      await request(application)
        .get("/signals?strategyIds=[999]")
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(0);
        });
    });

    test("Should throw 400 if taskIds param is invalid.", async () => {
      await request(application)
        .get("/signals?taskIds=1")
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should return signals by taskIds param", async () => {
      await request(application)
        .post("/tasks")
        .send({ ...mockTask(2, 1), marketId: 1 });

      await request(application)
        .get("/signals?taskIds=[1]")
        .expect((response) => {
          expect(response.status).toBe(200);
          response.body.forEach((signal) => expect(signal.taskId).toBe(1));
        });
    });

    test("Should return empty signals array by taskIds param", async () => {
      await request(application)
        .get("/signals?taskIds=[999]")
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(0);
        });
    });

    test("Should throw 400 if assets param is invalid.", async () => {
      await request(application)
        .get("/signals?assets=1")
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should return signals by assets param", async () => {
      await request(application)
        .get(`/signals?assets=["BTCUSDT"]`)
        .expect((response) => {
          expect(response.status).toBe(200);
          response.body.forEach((signal) => expect(signal.asset).toBe("BTCUSDT"));
        });
    });

    test("Should return empty signals array by assets param", async () => {
      await request(application)
        .get(`/signals?assets=["XRPXLM"]`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(0);
        });
    });
  });
});
