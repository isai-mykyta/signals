import { 
  Column, 
  DataType, 
  ForeignKey, 
  Model, 
  Table 
} from "sequelize-typescript";

import { MarketModel } from "./markets";
import { StrategyModel } from "./strategies";
import { TaskModel } from "./tasks";
import { StrategyAction } from "../types";

@Table({
  tableName: "Signals",
  timestamps: true,
})
export class SignalModel extends Model {
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

  @ForeignKey(() => TaskModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public taskId: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: false
  })
  public asset: string;

  @ForeignKey(() => MarketModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  public marketId: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: DataType.NOW
  })
  public producedAt: string | null;

  @Column({
    type: DataType.ARRAY(DataType.JSONB),
    allowNull: false,
  })
  public actionsTriggered: StrategyAction[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  public metadata: any | null;

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
