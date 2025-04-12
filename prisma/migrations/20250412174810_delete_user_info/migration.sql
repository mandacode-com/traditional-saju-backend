/*
  Warnings:

  - You are about to drop the `user_infos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_infos" DROP CONSTRAINT "user_infos_user_id_fkey";

-- DropTable
DROP TABLE "user_infos";
