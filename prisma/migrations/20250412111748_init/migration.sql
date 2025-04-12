-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "DatingStatus" AS ENUM ('single', 'dating', 'married');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('student', 'working', 'unemployed');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_infos" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT,
    "gender" "Gender",
    "age" INTEGER,
    "birthdate" TIMESTAMP(3),
    "dating" "DatingStatus",
    "job" "JobStatus",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_infos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_fortunes" (
    "id" SERIAL NOT NULL,
    "version" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "fortune" JSONB NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_fortunes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "yearly_fortunes" (
    "id" SERIAL NOT NULL,
    "version" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "fortune" JSONB NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "yearly_fortunes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_infos_user_id_key" ON "user_infos"("user_id");

-- AddForeignKey
ALTER TABLE "user_infos" ADD CONSTRAINT "user_infos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_fortunes" ADD CONSTRAINT "daily_fortunes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yearly_fortunes" ADD CONSTRAINT "yearly_fortunes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
