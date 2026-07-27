/*
  Warnings:

  - Added the required column `remainingQuantity` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fill" ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "remainingQuantity" INTEGER NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;
