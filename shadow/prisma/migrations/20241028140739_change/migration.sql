/*
  Warnings:

  - You are about to drop the `Datasource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Datasource";

-- CreateTable
CREATE TABLE "Metadata" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "databaseName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "schemas" JSONB NOT NULL,
    "useSSL" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);
