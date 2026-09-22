import { resumeMenuItem } from "@/entities/menu-item/api/server/menu-store";
import { handleMenuItemRouteError } from "@/entities/menu-item/api/server/route-error";
import { simulateMockApiRequest } from "@/shared/api/server/mock-api";
import { apiSuccess } from "@/shared/api/server/responses";

interface ResumeMenuItemRouteContext {
  params: Promise<{ id: string }>;
}

export const POST = async (
  _request: Request,
  { params }: ResumeMenuItemRouteContext,
) => {
  try {
    await simulateMockApiRequest();

    const { id } = await params;

    return apiSuccess(resumeMenuItem(id));
  } catch (error) {
    return handleMenuItemRouteError(error);
  }
};
