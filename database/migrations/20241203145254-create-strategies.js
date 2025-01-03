"use strict";

const { DataTypes, } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable("Strategies", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      marketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Markets",
          key: "id",
        },
      },
      assets: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      rules: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false,
      },
      actions: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false,
      },
      taskType: {
        type: DataTypes.ENUM("ONE_TIME", "CONTINUOUS"),
        allowNull: false,
      },
      taskSchedule: {
        type: DataTypes.JSONB,
        allowNull: true,
        validate: {
          isValidObject(value) {
            if (value !== null && typeof value !== "undefined") {
              if (typeof value !== "object") {
                throw new Error("taskSchedule must be a valid object.");
              }
              if (!value.hasOwnProperty("startAt") || typeof value.startAt !== "number") {
                throw new Error("taskSchedule must have a \"startAt\" property of type number.");
              }
              if (!value.hasOwnProperty("endAt") || typeof value.endAt !== "number") {
                throw new Error("Metadata must have a \"endAt\" property of type number.");
              }
            }
          },
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable("Strategies");
  },
};
