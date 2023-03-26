import { type User } from "@prisma/client";

type FieldsToPick = 'id' | 'name' | 'email' | 'image';

export const filterUserForClient = (user: User): Pick<User, FieldsToPick> => {
    const { id, name, email, image } = user;

    return {
        id, name, email, image
    };
}