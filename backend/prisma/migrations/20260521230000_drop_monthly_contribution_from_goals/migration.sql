-- AlterTable: drop monthly_contribution from goals (projection now computed from last 3 months of transactions)
ALTER TABLE "goals" DROP COLUMN "monthly_contribution";
