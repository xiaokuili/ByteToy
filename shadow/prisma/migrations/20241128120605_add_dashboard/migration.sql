-- CreateTable
CREATE TABLE "dashboard" (
    "dashboard_id" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "view_mode" TEXT NOT NULL,
    "llm_config" JSONB,
    "layout" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "visualization_id" TEXT,

    CONSTRAINT "dashboard_pkey" PRIMARY KEY ("dashboard_id","id")
);

-- AddForeignKey
ALTER TABLE "dashboard" ADD CONSTRAINT "dashboard_visualization_id_fkey" FOREIGN KEY ("visualization_id") REFERENCES "visualization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
