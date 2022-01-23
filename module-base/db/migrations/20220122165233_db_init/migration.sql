-- CreateTable
CREATE TABLE "Game" (
    "_id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uuid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "winner" TEXT,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("_id")
);
