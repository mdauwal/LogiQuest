/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateChainProgressTable1234567890123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "chain_progress",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "userId",
                    type: "int"
                },
                {
                    name: "chainId",
                    type: "int"
                },
                {
                    name: "currentStep",
                    type: "int",
                    default: 0
                },
                {
                    name: "completed",
                    type: "boolean",
                    default: false
                },
                {
                    name: "attemptsCount",
                    type: "int",
                    default: 0
                },
                {
                    name: "lastAttemptAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "score",
                    type: "int",
                    default: 0
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("chain_progress");
    }
}