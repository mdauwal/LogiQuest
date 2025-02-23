import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { ApiProperty } from '@nestjs/swagger'; // Importing the Swagger decorator

@Entity()
export class Achievement {
    @PrimaryGeneratedColumn()
    @ApiProperty({
        description: 'Unique identifier for the achievement.',
        example: 1,
    })
    id: number;

    @ManyToOne(() => User) 
    @ApiProperty({
        description: 'User associated with this achievement.',
        type: User, // Specify the related User entity for Swagger
    })
    user: User;

    @Column()
    @ApiProperty({
        description: 'Type of achievement (e.g., Badge, Trophy).',
        example: 'Badge',
    })
    type: string;

    @Column()
    @ApiProperty({
        description: 'Title of the achievement.',
        example: 'First Login',
    })
    title: string;

    @Column('text')
    @ApiProperty({
        description: 'Description of the achievement.',
        example: 'Awarded for completing the first login.',
    })
    description: string;

    @Column({ nullable: true })
    @ApiProperty({
        description: 'NFT token ID associated with the achievement, if applicable.',
        example: '123456789',
        required: false,
    })
    nftTokenId: string;

    @CreateDateColumn()
    @ApiProperty({
        description: 'Date and time when the achievement was unlocked.',
        example: '2025-02-18T08:00:00Z',
        type: String, // You can use Date if you prefer to display it as a Date object
    })
    unlockedAt: Date;
}
