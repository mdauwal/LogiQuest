import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";


@Entity()
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User) 
    user: User;

    @Column()
    type: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({ nullable: true })
    nftTokenId: string;

    @CreateDateColumn()
    unlockedAt: Date;
}
