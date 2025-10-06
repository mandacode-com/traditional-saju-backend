/*
  Warnings:

  - You are about to drop the column `user_id` on the `saju_records` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_public_id` to the `saju_records` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Drop foreign key constraint
ALTER TABLE "public"."saju_records" DROP CONSTRAINT "saju_records_user_id_fkey";

-- Step 2: Add user_public_id column (nullable first to allow data migration)
ALTER TABLE "public"."saju_records" ADD COLUMN "user_public_id" TEXT;

-- Step 3: Migrate existing data from users table
UPDATE "public"."saju_records" sr
SET user_public_id = u.public_id
FROM "public"."users" u
WHERE sr.user_id = u.id;

-- Step 4: Make user_public_id NOT NULL after data migration
ALTER TABLE "public"."saju_records" ALTER COLUMN "user_public_id" SET NOT NULL;

-- Step 5: Create index on user_public_id
CREATE INDEX "saju_records_user_public_id_idx" ON "public"."saju_records"("user_public_id");

-- Step 6: Drop user_id column
ALTER TABLE "public"."saju_records" DROP COLUMN "user_id";

-- Step 7: Drop users table
DROP TABLE "public"."users";
