import { Model, Column, DataType, Table, IsUrl } from "sequelize-typescript";

@Table({
  tableName: "Markets",
  timestamps: true,
})
export class MarketModel extends Model {
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

  @IsUrl
  @Column({
    type: DataType.STRING(2083),
    allowNull: false,
  })
  public url: string;

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
