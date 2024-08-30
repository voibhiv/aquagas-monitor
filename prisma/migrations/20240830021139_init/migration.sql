-- CreateTable
CREATE TABLE "measures" (
    "measure_uuid" TEXT NOT NULL,
    "measure_datetime" TIMESTAMP(3) NOT NULL,
    "measure_type" TEXT NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,
    "image_url" TEXT NOT NULL,
    "measure_value" INTEGER NOT NULL,
    "customer_code" TEXT NOT NULL,

    CONSTRAINT "measures_pkey" PRIMARY KEY ("measure_uuid")
);
