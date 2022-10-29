-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "qq" INTEGER NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "meter" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_qq_key" ON "User"("qq");
