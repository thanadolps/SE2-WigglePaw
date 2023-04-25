import { NextApiRequest, NextApiResponse } from "next";
import { deleteByUser } from "../../../../server/api/routers/userRouter";
import { createInnerTRPCContext } from "../../../../server/api/trpc";

const ctx = createInnerTRPCContext({ session: null });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await deleteByUser(ctx.s3, ctx.prisma, ctx.omise, {
      username: "bobby123",
    });
    await deleteByUser(ctx.s3, ctx.prisma, ctx.omise, {
      email: "boddy123@hotmail.com",
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(200).json({ success: false });
  }
}
