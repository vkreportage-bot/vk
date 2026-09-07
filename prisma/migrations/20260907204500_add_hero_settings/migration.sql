-- CreateTable
CREATE TABLE "HeroSettings" (
    "id" TEXT NOT NULL DEFAULT 'home',
    "mediaType" "MediaType",
    "mediaUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSettings_pkey" PRIMARY KEY ("id")
);
