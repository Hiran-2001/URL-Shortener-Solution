import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";

export class Url extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    longUrl: string;
  
    @Column({ nullable: true })
    customAlias: string;
  
    @Column({ nullable: true })
    topic: string;
  
    @Column()
    shortUrl: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
