/*
  Warnings:

  - The primary key for the `group_expense_splits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expenseId` on the `group_expense_splits` table. All the data in the column will be lost.
  - You are about to drop the column `isSettled` on the `group_expense_splits` table. All the data in the column will be lost.
  - You are about to drop the column `shareAmount` on the `group_expense_splits` table. All the data in the column will be lost.
  - You are about to drop the column `splitId` on the `group_expense_splits` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `group_expense_splits` table. All the data in the column will be lost.
  - The primary key for the `group_expenses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `group_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `expenseId` on the `group_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `group_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `group_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `paidBy` on the `group_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `splitType` on the `group_expenses` table. All the data in the column will be lost.
  - The primary key for the `groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `groupName` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `groups` table. All the data in the column will be lost.
  - The primary key for the `invitations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `invitationId` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `invitedBy` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `invitedPhone` on the `invitations` table. All the data in the column will be lost.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `notificationId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `notifications` table. All the data in the column will be lost.
  - The primary key for the `personal_expenses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `personal_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `personalExpenseId` on the `personal_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `personal_expenses` table. All the data in the column will be lost.
  - The primary key for the `sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `sessions` table. All the data in the column will be lost.
  - The primary key for the `settlements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `settlements` table. All the data in the column will be lost.
  - You are about to drop the column `expenseId` on the `settlements` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `settlements` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `settlements` table. All the data in the column will be lost.
  - You are about to drop the column `paidBy` on the `settlements` table. All the data in the column will be lost.
  - You are about to drop the column `paidTo` on the `settlements` table. All the data in the column will be lost.
  - You are about to drop the column `settlementId` on the `settlements` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profileImg` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `group_memberships` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[expense_id,user_id]` on the table `group_expense_splits` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[google_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expense_id` to the `group_expense_splits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `share_amount` to the `group_expense_splits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `group_expense_splits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `group_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paid_by` to the `group_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_name` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invited_by` to the `invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invited_phone` to the `invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `personal_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paid_by` to the `settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paid_to` to the `settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "group_expense_splits" DROP CONSTRAINT "group_expense_splits_expenseId_fkey";

-- DropForeignKey
ALTER TABLE "group_expense_splits" DROP CONSTRAINT "group_expense_splits_userId_fkey";

-- DropForeignKey
ALTER TABLE "group_expenses" DROP CONSTRAINT "group_expenses_groupId_fkey";

-- DropForeignKey
ALTER TABLE "group_expenses" DROP CONSTRAINT "group_expenses_paidBy_fkey";

-- DropForeignKey
ALTER TABLE "group_memberships" DROP CONSTRAINT "group_memberships_groupId_fkey";

-- DropForeignKey
ALTER TABLE "group_memberships" DROP CONSTRAINT "group_memberships_userId_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_groupId_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_invitedBy_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_groupId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "personal_expenses" DROP CONSTRAINT "personal_expenses_userId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "settlements" DROP CONSTRAINT "settlements_expenseId_fkey";

-- DropForeignKey
ALTER TABLE "settlements" DROP CONSTRAINT "settlements_groupId_fkey";

-- DropForeignKey
ALTER TABLE "settlements" DROP CONSTRAINT "settlements_paidBy_fkey";

-- DropForeignKey
ALTER TABLE "settlements" DROP CONSTRAINT "settlements_paidTo_fkey";

-- DropIndex
DROP INDEX "group_expense_splits_expenseId_userId_key";

-- DropIndex
DROP INDEX "users_googleId_key";

-- DropIndex
DROP INDEX "users_phoneNumber_key";

-- AlterTable
ALTER TABLE "group_expense_splits" DROP CONSTRAINT "group_expense_splits_pkey",
DROP COLUMN "expenseId",
DROP COLUMN "isSettled",
DROP COLUMN "shareAmount",
DROP COLUMN "splitId",
DROP COLUMN "userId",
ADD COLUMN     "expense_id" INTEGER NOT NULL,
ADD COLUMN     "is_settled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "share_amount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "split_id" SERIAL NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "group_expense_splits_pkey" PRIMARY KEY ("split_id");

-- AlterTable
ALTER TABLE "group_expenses" DROP CONSTRAINT "group_expenses_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "expenseId",
DROP COLUMN "groupId",
DROP COLUMN "isDeleted",
DROP COLUMN "paidBy",
DROP COLUMN "splitType",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expense_id" SERIAL NOT NULL,
ADD COLUMN     "group_id" INTEGER NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paid_by" INTEGER NOT NULL,
ADD CONSTRAINT "group_expenses_pkey" PRIMARY KEY ("expense_id");

-- AlterTable
ALTER TABLE "groups" DROP CONSTRAINT "groups_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "groupId",
DROP COLUMN "groupName",
DROP COLUMN "isDeleted",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" INTEGER NOT NULL,
ADD COLUMN     "group_id" SERIAL NOT NULL,
ADD COLUMN     "group_name" TEXT NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("group_id");

-- AlterTable
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "groupId",
DROP COLUMN "invitationId",
DROP COLUMN "invitedBy",
DROP COLUMN "invitedPhone",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "group_id" INTEGER NOT NULL,
ADD COLUMN     "invitation_id" SERIAL NOT NULL,
ADD COLUMN     "invited_by" INTEGER NOT NULL,
ADD COLUMN     "invited_phone" TEXT NOT NULL,
ADD CONSTRAINT "invitations_pkey" PRIMARY KEY ("invitation_id");

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "groupId",
DROP COLUMN "isRead",
DROP COLUMN "notificationId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "group_id" INTEGER,
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notification_id" SERIAL NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id");

-- AlterTable
ALTER TABLE "personal_expenses" DROP CONSTRAINT "personal_expenses_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "personalExpenseId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "personal_expense_id" SERIAL NOT NULL,
ADD COLUMN     "split_id" INTEGER,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "personal_expenses_pkey" PRIMARY KEY ("personal_expense_id");

-- AlterTable
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "expiresAt",
DROP COLUMN "refreshToken",
DROP COLUMN "sessionId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "refresh_token" TEXT NOT NULL,
ADD COLUMN     "session_id" SERIAL NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("session_id");

-- AlterTable
ALTER TABLE "settlements" DROP CONSTRAINT "settlements_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "expenseId",
DROP COLUMN "groupId",
DROP COLUMN "isCompleted",
DROP COLUMN "paidBy",
DROP COLUMN "paidTo",
DROP COLUMN "settlementId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expense_id" INTEGER,
ADD COLUMN     "group_id" INTEGER NOT NULL,
ADD COLUMN     "paid_by" INTEGER NOT NULL,
ADD COLUMN     "paid_to" INTEGER NOT NULL,
ADD COLUMN     "settlement_id" SERIAL NOT NULL,
ADD COLUMN     "split_id" INTEGER,
ADD CONSTRAINT "settlements_pkey" PRIMARY KEY ("settlement_id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "googleId",
DROP COLUMN "isActive",
DROP COLUMN "passwordHash",
DROP COLUMN "phoneNumber",
DROP COLUMN "profileImg",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "google_id" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "password_hash" TEXT,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "profile_img" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");

-- DropTable
DROP TABLE "group_memberships";

-- CreateTable
CREATE TABLE "group_membership" (
    "membership_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_membership_pkey" PRIMARY KEY ("membership_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_membership_user_id_group_id_key" ON "group_membership"("user_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_expense_splits_expense_id_user_id_key" ON "group_expense_splits"("expense_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_membership" ADD CONSTRAINT "group_membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_membership" ADD CONSTRAINT "group_membership_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expenses" ADD CONSTRAINT "group_expenses_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expenses" ADD CONSTRAINT "group_expenses_paid_by_fkey" FOREIGN KEY ("paid_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expense_splits" ADD CONSTRAINT "group_expense_splits_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "group_expenses"("expense_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expense_splits" ADD CONSTRAINT "group_expense_splits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_expenses" ADD CONSTRAINT "personal_expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_expenses" ADD CONSTRAINT "personal_expenses_split_id_fkey" FOREIGN KEY ("split_id") REFERENCES "group_expense_splits"("split_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "group_expenses"("expense_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_split_id_fkey" FOREIGN KEY ("split_id") REFERENCES "group_expense_splits"("split_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_paid_by_fkey" FOREIGN KEY ("paid_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_paid_to_fkey" FOREIGN KEY ("paid_to") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("group_id") ON DELETE SET NULL ON UPDATE CASCADE;
