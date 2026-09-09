import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isMissingTable(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2021"
  );
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Base de données non configurée." },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as { enabled?: unknown };

    if (typeof body.enabled !== "boolean") {
      return NextResponse.json(
        { error: "La valeur du mode maintenance est invalide." },
        { status: 400 }
      );
    }

    const maintenance = await prisma.maintenanceSettings.upsert({
      where: { id: "site" },
      create: {
        id: "site",
        enabled: body.enabled
      },
      update: {
        enabled: body.enabled
      }
    });

    revalidatePath("/", "layout");
    revalidatePath("/maintenance");

    return NextResponse.json({ maintenance });
  } catch (error) {
    if (isMissingTable(error)) {
      return NextResponse.json(
        {
          error:
            "La table MaintenanceSettings n’existe pas encore. Exécutez `npm run prisma:deploy` puis réessayez."
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible de modifier le mode maintenance."
      },
      { status: 500 }
    );
  }
}
