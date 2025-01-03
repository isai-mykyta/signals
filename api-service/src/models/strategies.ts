import { 
  Model, 
  Column, 
  DataType, 
  Table,
  ForeignKey, 
} from "sequelize-typescript";

import { MarketModel } from "./markets";
import { StrategyAction, StrategyRule, TaskSchedule, TaskType } from "../types";

@Table({
  tableName: "Strategies",
  timestamps: true,
})
export class StrategyModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  public id: number;

  @Column({
    type: DataType.STRING(40),
    allowNull: false,
  })
  public name: string;

  @ForeignKey(() => MarketModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public marketId: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  public assets: string[];

  @Column({
    type: DataType.ARRAY(DataType.JSONB),
    allowNull: false,
  })
  public rules: StrategyRule[];

  @Column({
    type: DataType.ARRAY(DataType.JSONB),
    allowNull: false,
  })
  public actions: StrategyAction[];

  @Column({
    type: DataType.ENUM(...Object.values(TaskType)),
    allowNull: false,
  })
  public taskType: TaskType;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  public taskSchedule: TaskSchedule;

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
