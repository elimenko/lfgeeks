import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const eventsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.event.findMany({
      take: 100,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      }
    });
  }),

  create: protectedProcedure.input(
    z.object({
      title: z.string().min(1).max(100),
    })
  ).mutation(async ({ ctx, input }) => {
    const { title } = input;

    const authorId = ctx.session.user.id;

    const event = await ctx.prisma.event.create({
      data: {
        title,
        authorId,
      },
    });

    return event;
  }),
});