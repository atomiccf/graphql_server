import { Task } from "@models/tasks.js";
import { createTask } from "@service/taskService.js";
import { taskInput } from "@graphql/types/taskInput.js";


export const taskResolvers = {
    Query: {
    getAllTasks: ({userId}: {userId: string}) => {
        if (!userId) return null;
        const tasks = Task.find({ _created_by: userId });
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
