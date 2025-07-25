import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from '@graphql/resolvers/user.resolvers.js';
import { taskResolvers } from '@graphql/resolvers/task.resolvers.js';
import { statusResolvers } from '@graphql/resolvers/status.resolvers.js';
import { priorityResolvers } from '@graphql/resolvers/priority.resolvers.js';
import { authResolvers } from "@graphql/resolvers/auth.resolvers.js";


export const resolvers = mergeResolvers([
    userResolvers,
    taskResolvers,
    statusResolvers,
    priorityResolvers,
    authResolvers
]);
