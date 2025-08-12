import { Task } from "@models/tasks.js";
import {createTask, deleteTask, updateTask} from "@service/taskService.js";
import {taskInput, taskUpdateInput} from "@graphql/types/taskInput.js";


export const taskResolvers = {
    Query: {
        getAllTasks: async (_parent: unknown, { userId }: { userId: string }) => {
            try {
                if (!userId) throw new Error('User ID is required');
                const tasks = await Task.find({ _created_by: userId })
                    .populate<{ priority: { _id: unknown; name: string ; color: string } }>('priority')
                    .populate<{ status: { _id: unknown; name: string ; color: string } }>('status')
                    .lean();

                return tasks.map(task => ({
                    ...task,
                    id: task._id.toString(),
                    priority: {
                        id: task.priority._id.toString(),
                        name: task.priority.name,
                        color: task.priority.color // Now available after populate
                    },
                    status: {
                        id: task.status._id.toString(),
                        name: task.status.name,
                        color: task.status.color // Now available after populate
                    }
                }));
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
                console.log('taskUpdateInput', taskUpdateInput);
                return await updateTask(taskUpdateInput);
            } catch (err) {
                console.error('Error updating task:', err);
                throw new Error('Failed to update task');
            }
        },

        deleteTask: async (_: unknown, { taskId }: { taskId: string }) => {
            try {
                console.log('deleteTask', taskId);
                return await deleteTask(taskId);
            } catch (err) {
                console.error('Error deleting task:', err);
                throw new Error('Failed to delete task');
            }
        }
    }
}
