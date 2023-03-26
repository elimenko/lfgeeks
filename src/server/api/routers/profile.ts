import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { filterUserForClient } from '~/server/helpers/filterUserForClient';

import {
  createTRPCRouter,
  publicProcedure
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
    getUserByUsername: publicProcedure.input(
        z.object({
            username: z.string(),
        })
    ).query(async ({ ctx, input }) => {
        const { username } = input;
        const user = await ctx.prisma.user.findFirst({
            where: {
                name: username,
            },
        });

        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            })
        }

        return filterUserForClient(user);
    }),
});