/*
  Warnings:

  - The primary key for the `group_expense_splits` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expense_id` on the `group_expense_splits` table. All the data in the column will be lost.
  - You are about to drop the column `is_settled` on the `group_expense_splits` table. All the data in the column will be lost.
  - You are about to drop the column `share_amount` on the `group_expense_splits` table. All the data in the column will be lost.
  - You are about to drop the column `split_id` on the `group_expense_splits` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `group_expense_splits` table. All the data in the column will be lost.
  - The primary key for the `group_expenses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `group_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `expense_id` on the `group_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `group_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `group_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `paid_by` on the `group_expenses` table. All the data in the column will be lost.
  - The primary key for the `groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `group_name` on the `groups` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `groups` table. All the data in the column will be lost.
  - The primary key for the `invitations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `invitation_id` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `invited_by` on the `invitations` table. All the data in the column will be lost.
  - You are about to drop the column `invited_phone` on the `invitations` table. All the data in the column will be lost.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `is_read` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `notification_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `notifications` table. All the data in the column will be lost.
  - The primary key for the `personal_expenses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `personal_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `personal_expense_id` on the `personal_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `split_id` on the `personal_expenses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `personal_expenses` table. All the data in the column will be lost.
  - The primary key for the `sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `session_id` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `sessions` table. All the data in the column will be lost.
  - The primary key for the `settlements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `settlements` table. All the data in the column will be lost.
  - You are about to drop the column `expense_id` on the `settlements` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `settlements` table. All the data in the column will be lost.
  - You are about to drop the column `paid_by` on the `settlements` table. All the data in the column will be lost.
  - You are about to drop the column `paid_to` on the `settlements` table. All the data in the column will be lost.
  - You are about to drop the column `settlement_id` on the `settlements` table. All the data in the column will be lost.
  - You are about to drop the column `split_id` on the `settlements` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `google_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_img` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `group_membership` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[expenseId,userId]` on the table `group_expense_splits` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expenseId` to the `group_expense_splits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shareAmount` to the `group_expense_splits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `group_expense_splits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `group_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paidBy` to the `group_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupName` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitedBy` to the `invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitedPhone` to the `invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `personal_expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupId` to the `settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paidBy` to the `settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paidTo` to the `settlements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "group_expense_splits" DROP CONSTRAINT "group_expense_splits_expense_id_fkey";

-- DropForeignKey
ALTER TABLE "group_expense_splits" DROP CONSTRAINT "group_expense_splits_user_id_fkey";

-- DropForeignKey
ALTER TABLE "group_expenses" DROP CONSTRAINT "group_expenses_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_expenses" DROP CONSTRAINT "group_expenses_paid_by_fkey";

-- DropForeignKey
ALTER TABLE "group_membership" DROP CONSTRAINT "group_membership_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_membership" DROP CONSTRAINT "group_membership_user_id_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_created_by_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_group_id_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_invited_by_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_group_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "personal_expenses" DROP CONSTRAINT "personal_expenses_split_id_fkey";

-- DropForeignKey
ALTER TABLE "personal_expenses" DROP CONSTRAINT "personal_expenses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "settlements" DROP CONSTRAINT "settlements_expense_id_fkey";

-- DropForeignKey
ALTER TABLE "settlements" DROP CONSTRAINT "settlements_group_id_fkey";

-- DropForeignKey
ALTER TABLE "settlements" DROP CONSTRAINT "settlements_paid_by_fkey";

-- DropForeignKey
ALTER TABLE "settlements" DROP CONSTRAINT "settlements_paid_to_fkey";

-- DropForeignKey
ALTER TABLE "settlements" DROP CONSTRAINT "settlements_split_id_fkey";

-- DropIndex
DROP INDEX "group_expense_splits_expense_id_user_id_key";

-- DropIndex
DROP INDEX "users_google_id_key";

-- DropIndex
DROP INDEX "users_phone_number_key";

-- AlterTable
ALTER TABLE "group_expense_splits" DROP CONSTRAINT "group_expense_splits_pkey",
DROP COLUMN "expense_id",
DROP COLUMN "is_settled",
DROP COLUMN "share_amount",
DROP COLUMN "split_id",
DROP COLUMN "user_id",
ADD COLUMN     "expenseId" INTEGER NOT NULL,
ADD COLUMN     "isSettled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "splitId" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "group_expense_splits_pkey" PRIMARY KEY ("splitId");

-- AlterTable
ALTER TABLE "group_expenses" DROP CONSTRAINT "group_expenses_pkey",
DROP COLUMN "created_at",
DROP COLUMN "expense_id",
DROP COLUMN "group_id",
DROP COLUMN "is_deleted",
DROP COLUMN "paid_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expenseId" SERIAL NOT NULL,
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidBy" INTEGER NOT NULL,
ADD COLUMN     "splitType" TEXT NOT NULL DEFAULT 'equal',
ADD CONSTRAINT "group_expenses_pkey" PRIMARY KEY ("expenseId");

-- AlterTable
ALTER TABLE "groups" DROP CONSTRAINT "groups_pkey",
DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "group_id",
DROP COLUMN "group_name",
DROP COLUMN "is_deleted",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "groupId" SERIAL NOT NULL,
ADD COLUMN     "groupName" TEXT NOT NULL,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "groups_pkey" PRIMARY KEY ("groupId");

-- AlterTable
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_pkey",
DROP COLUMN "created_at",
DROP COLUMN "group_id",
DROP COLUMN "invitation_id",
DROP COLUMN "invited_by",
DROP COLUMN "invited_phone",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD COLUMN     "invitationId" SERIAL NOT NULL,
ADD COLUMN     "invitedBy" INTEGER NOT NULL,
ADD COLUMN     "invitedPhone" TEXT NOT NULL,
ADD CONSTRAINT "invitations_pkey" PRIMARY KEY ("invitationId");

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
DROP COLUMN "created_at",
DROP COLUMN "group_id",
DROP COLUMN "is_read",
DROP COLUMN "notification_id",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "groupId" INTEGER,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notificationId" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("notificationId");

-- AlterTable
ALTER TABLE "personal_expenses" DROP CONSTRAINT "personal_expenses_pkey",
DROP COLUMN "created_at",
DROP COLUMN "personal_expense_id",
DROP COLUMN "split_id",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "personalExpenseId" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "personal_expenses_pkey" PRIMARY KEY ("personalExpenseId");

-- AlterTable
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_pkey",
DROP COLUMN "created_at",
DROP COLUMN "expires_at",
DROP COLUMN "refresh_token",
DROP COLUMN "session_id",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "sessionId" SERIAL NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("sessionId");

-- AlterTable
ALTER TABLE "settlements" DROP CONSTRAINT "settlements_pkey",
DROP COLUMN "created_at",
DROP COLUMN "expense_id",
DROP COLUMN "group_id",
DROP COLUMN "paid_by",
DROP COLUMN "paid_to",
DROP COLUMN "settlement_id",
DROP COLUMN "split_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expenseId" INTEGER,
ADD COLUMN     "groupId" INTEGER NOT NULL,
ADD COLUMN     "is_completed" BOOLEAN DEFAULT false,
ADD COLUMN     "paidBy" INTEGER NOT NULL,
ADD COLUMN     "paidTo" INTEGER NOT NULL,
ADD COLUMN     "settlementId" SERIAL NOT NULL,
ADD CONSTRAINT "settlements_pkey" PRIMARY KEY ("settlementId");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "created_at",
DROP COLUMN "google_id",
DROP COLUMN "is_active",
DROP COLUMN "password_hash",
DROP COLUMN "phone_number",
DROP COLUMN "profile_img",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "passwordHash" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "profileImg" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userId");

-- DropTable
DROP TABLE "group_membership";

-- CreateTable
CREATE TABLE "group_memberships" (
    "membershipId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_memberships_pkey" PRIMARY KEY ("membershipId")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_memberships_userId_groupId_key" ON "group_memberships"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "group_expense_splits_expenseId_userId_key" ON "group_expense_splits"("expenseId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expenses" ADD CONSTRAINT "group_expenses_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expenses" ADD CONSTRAINT "group_expenses_paidBy_fkey" FOREIGN KEY ("paidBy") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expense_splits" ADD CONSTRAINT "group_expense_splits_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "group_expenses"("expenseId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_expense_splits" ADD CONSTRAINT "group_expense_splits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal_expenses" ADD CONSTRAINT "personal_expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "group_expenses"("expenseId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_paidBy_fkey" FOREIGN KEY ("paidBy") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settlements" ADD CONSTRAINT "settlements_paidTo_fkey" FOREIGN KEY ("paidTo") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("groupId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_memberships" ADD CONSTRAINT "group_memberships_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("groupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_memberships" ADD CONSTRAINT "group_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
