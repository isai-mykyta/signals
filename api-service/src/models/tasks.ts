import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

import { StrategyModel } from "./strategies";
import { TaskStatus } from "../types";

@Table({
  tableName: "Tasks",
  timestamps: true,
})
export class TaskModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  public id: number;

  @ForeignKey(() => StrategyModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public strategyId: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  public startedAt: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  public endedAt: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  public lastSignalAt: string;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
  })
  public status: TaskStatus;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  public isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  public createdAt: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  public updatedAt: string;
}
