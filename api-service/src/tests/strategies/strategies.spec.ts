import { Server } from "http";

import { Sequelize } from "sequelize-typescript";
import request from "supertest";

import { app } from "../../app";
import { sequelizeConfig } from "../../configs";
import { MarketModel, StrategyModel } from "../../models";
import { ActionType, Comprasion, StrategyRuleType, TaskType, TimeFrameUnit } from "../../types";
import { mockMarket } from "../fixtures";

let sequelize: Sequelize;
let application: Server;

const strategyPayload = {
  name: "test strategy",
  marketId: 1,
  assets: ["BTCTUSD"],
  taskType: TaskType.ONE_TIME,
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

describe("Strategies Integration Tests", () => {
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
    await sequelize.close();
    application.close();
  });

  describe("Create strategy.", () => {
    test("Should throw 400 if trying to create a new strategy with invalid market id.", async () => {
      await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, marketId: 999 })
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should throw 400 if trying to create a new strategy with invalid assets.", async () => {
      await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, assets: [1] })
        .expect((response) => {
          expect(response.status).toBe(400);
        });

      await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, assets: "BTCUSDT" })
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should throw 400 if trying to create a new strategy with invalid taskType.", async () => {
      await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, taskType: "INVALID_TYPE" })
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should throw 400 if trying to create a new strategy with invalid taskSchedule.", async () => {
      await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, taskSchedule: { startAt: "startAt", endAt: "endAt" } })
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should throw 400 if trying to create a new strategy with invalid actions.", async () => {
      await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, actions: [{ type: "INVALID_TYPE" }] })
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should throw 400 if trying to create a new strategy with invalid rules.", async () => {
      await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, rules: [{ type: "INVALID_RULE", comparison: "INVALID_COMPRASSION" }] })
        .expect((response) => {
          expect(response.status).toBe(400);
        });
    });

    test("Should create new strategy.", async () => {
      await request(application)
        .post("/markets")
        .send(mockMarket(1, "Market"));

      await request(application)
        .post("/strategies")
        .send({ ...strategyPayload, marketId: 1 })
        .expect((response) => {
          expect(response.status).toBe(201);
          expect(response.body.name).toBe(strategyPayload.name);
          expect(response.body.assets).toStrictEqual(strategyPayload.assets);
          expect(response.body.rules).toStrictEqual(strategyPayload.rules);
          expect(response.body.actions).toStrictEqual(strategyPayload.actions);
          expect(response.body.taskType).toStrictEqual(strategyPayload.taskType);
        });
    });
  });

  describe("Get strategy by id.", () => {
    test("Should return strategy by id.", async () => {
      await request(application)
        .get("/strategies/1")
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.id).toBe(1);
        });
    });

    test("Should throw 404 if strategy by id is not found.", async () => {
      await request(application)
        .get("/strategies/999")
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
  });

  describe("Search strategies.", () => {
    test("Should search strategies with empty query params.", async () => {
      await request(application)
        .get("/strategies")
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(1);
        });
    });

    test("Should search strategies by ids.", async () => {
      await request(application)
        .get("/strategies?ids=[1]")
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(1);
        });
    });

    test("Should not return any strategies if ids don't match.", async () => {
      await request(application)
        .get("/strategies?ids=[900]")
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(0);
        });
    });

    test("Should search strategies by names.", async () => {
      await request(application)
        .get(`/strategies?names=["test strategy"]`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(1);
        });
    });

    test("Should not return any strategies if names don't match.", async () => {
      await request(application)
        .get(`/strategies?names=["invalid name"]`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(0);
        });
    });

    test("Should search strategies by marketIds.", async () => {
      await request(application)
        .get(`/strategies?marketIds=[1]`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(1);
        });
    });

    test("Should not return any strategies if marketIds don't match.", async () => {
      await request(application)
        .get(`/strategies?marketIds=[999]`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(0);
        });
    });

    test("Should search strategies by assets.", async () => {
      await request(application)
        .get(`/strategies?assets=["BTCTUSD"]`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(1);
        });
    });

    test("Should not return any strategies if assets don't match.", async () => {
      await request(application)
        .get(`/strategies?assets=["ETHUSDT"]`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(0);
        });
    });

    test("Should search strategies by from value.", async () => {
      const date = new Date();
      date.setFullYear(2024);
      await request(application)
        .get(`/strategies?from=${date.toISOString()}`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(1);
        });
    });

    test("Should not return any strategies if from value doesn't match.", async () => {
      await request(application)
        .get(`/strategies?from=${new Date().toISOString()}`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(0);
        });
    });

    test("Should search strategies by to value.", async () => {
      const date = new Date();
      date.setFullYear(2030);
      await request(application)
        .get(`/strategies?to=${date.toISOString()}`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(1);
        });
    });

    test("Should not return any strategies if to value doesn't match.", async () => {
      const date = new Date();
      date.setFullYear(2024);
      await request(application)
        .get(`/strategies?to=${date.toISOString()}`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.length).toBe(0);
        });
    });
  });

  describe("Delete strategy.", () => {
    test("Should throw 404 if trying to delete strategy that doesn't exist.", async () => {
      await request(application)
        .delete(`/strategies/999`)
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });

    test("Should delete strategy by id.", async () => {
      await request(application)
        .delete(`/strategies/1`)
        .expect((response) => {
          expect(response.status).toBe(204);
        });
    });
  });
});
