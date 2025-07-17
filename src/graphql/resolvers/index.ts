import { mergeResolvers } from '@graphql-tools/merge';
import { userResolvers } from './user.resolvers.js';
import { taskResolvers } from './task.resolvers.js';
import { statusResolvers } from './status.resolvers.js';
import { priorityResolvers } from './priority.resolvers.js';


export const resolvers = mergeResolvers([
    userResolvers,
    taskResolvers,
    statusResolvers,
    priorityResolvers
]);
