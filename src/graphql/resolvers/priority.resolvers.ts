import { Priority } from '@models/priority.js';
import { createPriority } from "@service/priorityService.js";
import { PriorityInput } from "@graphql/types/priorityInput.js";


export const priorityResolvers = {
    Query: {
        async getAllPriorities() {
            try {
                return await Priority.find();
            }catch (e) {
                throw new Error('Failed to fetch priorities');
            }

        }
    },
    Mutation: {
        addPriority: async (_: unknown, { priorityInput }: { priorityInput: PriorityInput }) => {
            try {
                const { name, color } = priorityInput.priorityInput;
                const existingStatus = await Priority.findOne({ name });
                if (existingStatus) {
                    throw new Error('Priority already exists');
                }
                await createPriority(name, color);

            } catch (error) {
                console.error('Error creating status:', error);
                throw new Error('Failed to create status');
            }
        }
    }
};
