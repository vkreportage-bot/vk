CREATE TABLE "MaintenanceSettings" (
    "id" TEXT NOT NULL DEFAULT 'site',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceSettings_pkey" PRIMARY KEY ("id")
);
