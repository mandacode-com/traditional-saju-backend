-- CreateEnum
CREATE TYPE "SajuType" AS ENUM ('DAILY', 'YEARLY');

-- CreateTable
CREATE TABLE "latest_saju" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "version" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "type" "SajuType" NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "latest_saju_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "latest_saju_uuid_key" ON "latest_saju"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "latest_saju_user_uuid_type_key" ON "latest_saju"("user_uuid", "type");
