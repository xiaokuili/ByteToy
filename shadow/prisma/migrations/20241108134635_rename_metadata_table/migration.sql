/*
  Warnings:

  - You are about to drop the `Metadata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Metadata";

-- CreateTable
CREATE TABLE "metadata" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "display_name" VARCHAR(50) NOT NULL,
    "host" VARCHAR(100) NOT NULL,
    "port" SMALLINT NOT NULL,
    "database_name" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "schemas" JSONB NOT NULL,
    "use_ssl" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "metadata_pkey" PRIMARY KEY ("id")
);
