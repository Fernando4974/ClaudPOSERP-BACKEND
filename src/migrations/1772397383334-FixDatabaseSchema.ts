import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixDatabaseSchema1772397383334 implements MigrationInterface {
  name = 'FixDatabaseSchema1772397383334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "membership_start" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "membership_end" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "UQ_c30f00a871de74c8e8c213acc4a" UNIQUE ("title")`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "UQ_adfc522baf9d9b19cd7d9461b7e"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "UQ_adfc522baf9d9b19cd7d9461b7e" UNIQUE ("barcode")`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "UQ_c30f00a871de74c8e8c213acc4a"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "membership_end"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "membership_start"`,
    );
  }
}
