/*
  Warnings:

  - Made the column `price` on table `Fill` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Fill" ALTER COLUMN "price" SET NOT NULL;
