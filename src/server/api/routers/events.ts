import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { TRPCError } from '@trpc/server';

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";


// TODO: for testing purpose. Overall this entity does not need this
// Create a new ratelimiter, that allows 3 requests per 1 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true
});

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
      title: z.string().min(1).max(100, "Event title is too long"),
    })
  ).mutation(async ({ ctx, input }) => {
    const { title } = input;

    const authorId = ctx.session.user.id;

    const { success } = await ratelimit.limit(authorId);

    if (!success) {
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
    }

    const event = await ctx.prisma.event.create({
      data: {
        title,
        authorId,
      },
    });

    return event;
  }),
});