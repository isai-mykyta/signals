import { Server } from "http";

import { Sequelize } from "sequelize-typescript";
import request from "supertest";

import { app } from "../../app";
import { sequelizeConfig } from "../../configs";
import { MarketModel } from "../../models";

let sequelize: Sequelize;
let application: Server;

describe("Markets Integration Tests", () => {
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
    await sequelize.close();
    application.close();
  });

  describe("Create market.", () => {
    test("Should create new market.", async () => {
      await request(application)
        .post("/markets")
        .send({ name: "Test market", url: "http://example.com" })
        .expect(async (response) => {
          expect(response.status).toBe(201);
          expect(response.body.name).toBe("Test market");
          expect(response.body.url).toBe("http://example.com");
        });
    });

    test("Should return BadRequest exception when creating market with invalid data.", async () => {
      await request(application)
        .post("/markets")
        .send({ name: 999, url: 999 })
        .expect(400);
    });
  });

  describe("Get market by id.", () => {
    test("Should return market by id.", async () => {
      await request(application)
        .get(`/markets/1`)
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.id).toBe(response.body.id);
        });
    });

    test("Should return 404 if market is not found.", async () => {
      await request(application)
        .get("/markets/999")
        .expect(404);
    });
  });

  describe("Search markets.", () => {
    test("Should search markets when query parameters are not provided.", async () => {
      await request(application)
        .get("/markets")
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBe(1);
        });
    });

    describe("Should search markets by query params.", () => {
      test("Should return market with matching id.", async () => {
        await request(application).get(`/markets?ids=[1]`)
          .expect((response) => {
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
          });
      });

      test("Should not return a market with id that doesn't exist.", async () => {
        await request(application).get("/markets?ids=[999]")
          .expect((response) => {
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
          });
      });

      test("Should return a market with matching name.", async () => {
        await request(application).get(`/markets?names=["Test market"]`)
          .expect((response) => {
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
          });
      });

      test("Should not return a market by name that doesn't exists.", async () => {
        await request(application).get(`/markets?names=["Invalid market"]`)
          .expect((response) => {
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
          });
      });

      test("Should not return a market by name that doesn't exists.", async () => {
        await request(application).get(`/markets?names=["Invalid market"]`)
          .expect((response) => {
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
          });
      });
    });

    describe("Should return BadRequest exception if query params are invalid.", () => {
      test("Should return BadRequest exception if ids query param is invalid", async () => {
        await request(application)
          .get("/markets?ids=1")
          .expect((response) => expect(response.status).toBe(400));
      });

      test("Should return BadRequest exception if names query param is invalid", async () => {
        await request(application)
          .get("/markets?names=invalidName")
          .expect((response) => {
            expect(response.status).toBe(400);
          });

        await request(application)
          .get("/markets?names=1")
          .expect((response) => {
            expect(response.status).toBe(400);
          });
      });

      test("Should return BadRequest exception if url query param is invalid", async () => {
        await request(application)
          .get("/markets?url=1")
          .expect((response) => { 
            expect(response.status).toBe(400);
          });
      });

      test("Should return BadRequest exception if from query param is invalid", async () => {
        await request(application)
          .get("/markets?from=invalidDateString")
          .expect((response) => { 
            expect(response.status).toBe(400);
          });
      });

      test("Should return BadRequest exception if to query param is invalid", async () => {
        await request(application)
          .get("/markets?to=invalidDateString")
          .expect((response) => { 
            expect(response.status).toBe(400);
          });
      });

      test("Should return BadRequest exception if limit query param is invalid", async () => {
        await request(application)
          .get("/markets?limit=invalidLimit")
          .expect((response) => { 
            expect(response.status).toBe(400);
          });
      });

      test("Should return BadRequest exception if offset query param is invalid", async () => {
        await request(application)
          .get("/markets?offset=invalidOffset")
          .expect((response) => { 
            expect(response.status).toBe(400);
          });
      });

      test("Should return BadRequest exception if order query param is invalid", async () => {
        await request(application)
          .get("/markets?order=invalidOrder")
          .expect((response) => {
            expect(response.status).toBe(400);
          });
      });

      test("Should return BadRequest exception if one of query params is invalid", async () => {
        await request(application)
          .get("/markets?order=invalidOrder&ids=[1]")
          .expect((response) => { 
            expect(response.status).toBe(400);
          });
      });
    });
  });

  describe("Update market by id.", () => {
    test("Should update market by id.", async () => {
      await request(application)
        .put(`/markets/1`)
        .send({ name: "Updated name", url: "http://some-new-url.com" })
        .expect((response) => {
          expect(response.status).toBe(200);
          expect(response.body.name).toBe("Updated name");
          expect(response.body.url).toBe("http://some-new-url.com");
        });
    });

    test("Should throw a NotFound exception if trying to update a market that does not exist.", async () => {
      await request(application)
        .put("/markets/999")
        .send({ name: "Updated name", url: "http://some-new-url.com" })
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
  });

  describe("Delete market by id.", () => {
    test("Should delete market by id.", async () => {
      await request(application)
        .delete(`/markets/1`)
        .expect((response) => {
          expect(response.status).toBe(204);
          expect(response.body).toStrictEqual({});
        });
    });

    test("Should throw a NotFound exception if trying to delete a market that does not exist.", async () => {
      await request(application)
        .delete("/markets/999")
        .expect((response) => {
          expect(response.status).toBe(404);
        });
    });
  });
});
