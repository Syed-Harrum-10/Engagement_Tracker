/*
  Warnings:

  - You are about to drop the `_EventToImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."_EventToImage" DROP CONSTRAINT "_EventToImage_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_EventToImage" DROP CONSTRAINT "_EventToImage_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_EventToUser" DROP CONSTRAINT "_EventToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_EventToUser" DROP CONSTRAINT "_EventToUser_B_fkey";

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "imageId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."_EventToImage";

-- DropTable
DROP TABLE "public"."_EventToUser";

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
