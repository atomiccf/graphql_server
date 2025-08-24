import {
    createTask,
    deleteTask,
    updateTask,
    updateTaskPriority,
    updateTaskStatus,
    userTaskList
} from "@service/taskService.js";
import {
    taskInput,
    taskUpdateInput, TaskUpdatePriorityInput,  TaskUpdateStatusInput,
} from "@graphql/types/taskInput.js";


export const taskResolvers = {
    Query: {
        getAllTasks: async (_parent: unknown, { userId }: { userId: string }) => {
            try {
                return userTaskList(userId);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
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

        updateTask: async (_: unknown, { taskUpdateInput }: taskUpdateInput) => {
            try {
                return await updateTask(taskUpdateInput);
            } catch (err) {
                console.error('Error updating task:', err);
                throw new Error('Failed to update task');
            }
        },

        deleteTask: async (_: unknown, { taskId }: { taskId: string }) => {
            try {
                return await deleteTask(taskId);
            } catch (err) {
                console.error('Error deleting task:', err);
                throw new Error('Failed to delete task');
            }
        },
        updateTaskStatus: async (_: unknown, { taskUpdateStatusInput }: TaskUpdateStatusInput) => {
            try {
                return await updateTaskStatus(taskUpdateStatusInput);
            } catch (err) {
                console.error('Error updating task status:', err);
                throw new Error('Failed to update task status');
            }
        },
        updateTaskPriority: async (_: unknown, { taskUpdatePriorityInput }: TaskUpdatePriorityInput) => {
            try {
                return await updateTaskPriority(taskUpdatePriorityInput);
            } catch (err) {
                console.error('Error updating task priority:', err);
                throw new Error('Failed to update task priority');
            }
        },

    }
}
