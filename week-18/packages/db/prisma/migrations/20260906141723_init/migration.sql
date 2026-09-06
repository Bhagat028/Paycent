-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "age" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
