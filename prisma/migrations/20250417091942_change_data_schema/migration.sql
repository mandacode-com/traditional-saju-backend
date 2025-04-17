/*
  Warnings:

  - You are about to drop the `daily_fortunes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `yearly_fortunes` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SajuType" AS ENUM ('DAILY', 'YEARLY');

-- DropForeignKey
ALTER TABLE "daily_fortunes" DROP CONSTRAINT "daily_fortunes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "yearly_fortunes" DROP CONSTRAINT "yearly_fortunes_user_id_fkey";

-- DropTable
DROP TABLE "daily_fortunes";

-- DropTable
DROP TABLE "yearly_fortunes";

-- DropEnum
DROP TYPE "DatingStatus";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "JobStatus";

-- CreateTable
CREATE TABLE "last_saju" (
    "id" SERIAL NOT NULL,
    "version" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "type" "SajuType" NOT NULL,
    "data" JSONB NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "last_saju_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "last_saju_user_id_type_key" ON "last_saju"("user_id", "type");

-- AddForeignKey
ALTER TABLE "last_saju" ADD CONSTRAINT "last_saju_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
