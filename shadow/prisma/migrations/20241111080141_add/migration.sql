-- CreateTable
CREATE TABLE "visualization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "datasource_id" TEXT NOT NULL,
    "sql_content" TEXT NOT NULL,
    "view_mode" TEXT NOT NULL,
    "view_params" JSONB NOT NULL,
    "sql_variables" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visualization_pkey" PRIMARY KEY ("id")
);
