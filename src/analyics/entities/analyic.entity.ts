import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Analytics extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  urlId: number;

  @Column()
  userAgent: string;

  @Column()
  ip: string;

  @Column()
  osType: string;

  @Column()
  deviceType: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
