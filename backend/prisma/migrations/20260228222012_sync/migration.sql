/*
  Warnings:

  - You are about to drop the column `isCompleted` on the `settlements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "settlements" DROP COLUMN "isCompleted",
ADD COLUMN     "is_completed" BOOLEAN DEFAULT false;
