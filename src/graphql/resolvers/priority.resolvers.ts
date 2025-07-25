import { Priority } from '@models/priority.js';
import { createPriority, deletePriority, updatePriority } from "@service/priorityService.js";
import {PriorityInput, UpdatePriorityInput} from "@graphql/types/priorityInput.js";


export const priorityResolvers = {
    Query: {
        async getAllPriorities() {
            try {
                return await Priority.find();
            } catch (e) {
                throw new Error('Failed to fetch priorities');
            }

        }
    },
    Mutation: {
        addPriority: async (_: unknown, {priorityInput}: PriorityInput) => {
            console.log('priorityInput', priorityInput);
            try {
                const {name, color} = priorityInput;
                return await createPriority(name, color);

            } catch (error) {
                console.error('Error creating priority:', error);
                throw new Error('Failed to create priority');
            }
        },

        updatePriority: async (_: unknown, { updateInput }: UpdatePriorityInput) => {
            try {

                const {_id, name, color} = updateInput;
                return await updatePriority(_id , name, color);
            } catch (error) {
                console.error('Error creating priority:', error);
                throw new Error('Failed to update priority');
            }
        },

        deletePriority: async (_: unknown, { _id }: { _id: string }) => {
            try {
                return await deletePriority(_id);
            } catch (error) {
                console.error('Error creating priority:', error);
                throw new Error('Failed to delete priority');
            }
        }
    }
};
