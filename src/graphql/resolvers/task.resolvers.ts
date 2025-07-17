import { Task } from "@models/tasks.js";
import { createTask } from "@service/taskService.js";
import { taskInput } from "@graphql/types/taskInput.js";


export const taskResolvers = {
    Query: {
    getAllTasks: async (_parent:unknown, { userId }: { userId: string} ) => {
        console.log('userId_getAllTasks', userId);
        try {
            if (!userId) throw new Error('User ID is required');
            return await Task.find({ _created_by: userId });
        } catch (error) {
            throw new Error('Failed to fetch tasks');
        }
    },

    },

    Mutation: {
        addTask: async (_: unknown, { taskInput }: taskInput) => {
            try {
                return await createTask(taskInput);
            } catch (err) {
                console.error('Error creating task:', err);
                throw new Error('Failed to create task');
            }
        },
    }
}
