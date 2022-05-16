-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_driverId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "driverId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
