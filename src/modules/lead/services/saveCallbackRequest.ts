import type { CallbackRequestInput } from "../validators/callbackRequestSchema";
import { prisma } from "@/lib/prisma";
async function saveCallbackRequest(formData: CallbackRequestInput) {
  const newRequest = await prisma.callbackRequest.create({
    data: formData,
  });
  return newRequest;
}
export default saveCallbackRequest;
