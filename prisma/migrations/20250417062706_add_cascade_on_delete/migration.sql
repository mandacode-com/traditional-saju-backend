-- DropForeignKey
ALTER TABLE "daily_fortunes" DROP CONSTRAINT "daily_fortunes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "yearly_fortunes" DROP CONSTRAINT "yearly_fortunes_user_id_fkey";

-- AddForeignKey
ALTER TABLE "daily_fortunes" ADD CONSTRAINT "daily_fortunes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "yearly_fortunes" ADD CONSTRAINT "yearly_fortunes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
