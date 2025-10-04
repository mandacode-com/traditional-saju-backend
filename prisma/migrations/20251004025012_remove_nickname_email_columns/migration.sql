/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."users_email_key";

-- DropIndex
DROP INDEX "public"."users_nickname_key";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "email",
DROP COLUMN "nickname";
