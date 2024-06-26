import { fixedNumber } from 'src/utils';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  constructor(data?: Partial<BaseEntity>) {
    this.id = data?.id;
    this.createdAt = data?.createdAt;
    this.updatedAt = data?.updatedAt;
  }
}

export enum BaseStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export class ColumnNumericTransformer {
  public to(data: number): number {
    return data;
  }
  public from(data: string): number {
    if (!data) return null;
    return parseFloat(fixedNumber(data));
  }
}
