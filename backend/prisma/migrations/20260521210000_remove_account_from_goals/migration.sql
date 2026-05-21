-- AlterTable: drop account_id from goals (goals now aggregate all non-buffer accounts)
ALTER TABLE "goals" DROP COLUMN "account_id";
