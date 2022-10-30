/*
  Warnings:

  - You are about to drop the column `meter` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "qq" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "meterId" TEXT
);
INSERT INTO "new_User" ("id", "password", "qq", "username") SELECT "id", "password", "qq", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_qq_key" ON "User"("qq");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
