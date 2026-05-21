-- AlterTable: add monthly_contribution to goals
ALTER TABLE "goals" ADD COLUMN "monthly_contribution" DECIMAL(12,2);
