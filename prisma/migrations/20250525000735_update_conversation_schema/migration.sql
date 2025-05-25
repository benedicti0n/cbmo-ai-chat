/*
  Warnings:

  - You are about to drop the column `userId` on the `Conversation` table. All the data in the column will be lost.
  - Added the required column `clerkId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_userId_fkey";

-- DropIndex
DROP INDEX "conversation_user_id_idx";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "userId",
ADD COLUMN     "clerkId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "conversation_clerk_id_idx" ON "Conversation"("clerkId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_clerkId_fkey" FOREIGN KEY ("clerkId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
