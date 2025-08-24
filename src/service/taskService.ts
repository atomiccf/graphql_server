import mongoose, { Types, } from 'mongoose';
import { Task} from '@models/tasks.js';
import { Priority } from '@models/priority.js';
import { Status } from "@models/status.js";
import { saveUploadedFile } from '@utils/fileUpload.js';
import { createImagePublicUrl } from "@utils/createImagePublicUrl.js";
import { File, TaskUpdatePriorityInput, TaskUpdateStatusInput } from '@graphql/types/taskInput.js';

type CreateTaskParams = {
    title: string;
    description: string;
    date: string;
    priority: string;
    userId: string;
    image?: Promise<File>;
};

type UpdateTaskParams = {
    title: string;
    taskId: string;
    description: string;
    date: string;
    priority: string;
    userId: string;
    image?: Promise<File>;
};

export async function createTask({
                                     title,
                                     description,
                                     date,
                                     priority,
                                     userId,
                                     image
                                 }: CreateTaskParams): Promise<string> {
    try {
        const prioritySearch = await Priority.findOne({ name:priority });
        const statusSearch = await Status.findOne({ name:'Not Started' });
        const existingTask = await Task.findOne({ title });
        if (existingTask) {
            throw new Error('Task already exists');
        }

        const imagePath = image ? await saveUploadedFile(image, userId) : null;
        let publicUrl

        if (imagePath) {
            publicUrl = createImagePublicUrl(imagePath);
        }
        const newTask = new Task({
            title,
            description,
            priority: prioritySearch?._id,
            status:statusSearch?._id,
            image: imagePath,
            publicUrl: publicUrl,
            _created_by: userId,
            _created_at: new Date(date),
        });

        await newTask.save();
        return 'Task created successfully';
    } catch (e) {
        console.error('Error creating task:', e);
        throw new Error('Failed to create task');
    }

}


export async function updateTask({
                                     title,
                                     taskId,
                                     description,
                                     date,
                                     priority,
                                     userId,
                                     image
                                 }: UpdateTaskParams): Promise<string> {
    try{
        const existingTask = await Task.findOne({ _id: taskId });
        if (!existingTask) {
            throw new Error('Task not found');
        }

        const prioritySearch = await Priority.findOne({ name: priority });
        if (!prioritySearch) {
            throw new Error('Priority not found');
        }

        const imagePath = image ? await saveUploadedFile(image, userId) : null;
        let publicUrl: string | undefined;

        if (imagePath) {
            publicUrl = createImagePublicUrl(imagePath);
            existingTask.image = imagePath;
            existingTask.publicUrl = publicUrl;
        }

        if (title !== undefined) existingTask.title = title;
        if (description !== undefined) existingTask.description = description;

        existingTask.priority = prioritySearch._id as Types.ObjectId;

        if (date !== undefined && date !== null) {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                throw new Error('Invalid date: The provided date string is not valid.');
            }

            if (!date.includes('T') || !date.endsWith('+00:00')) {
                console.warn('Date is not in expected ISO format (YYYY-MM-DDTHH:mm:ss.SSS+00:00)');
            }
            existingTask._updated_at = parsedDate;
        }

        await existingTask.save();

        return 'Task updated successfully';
    } catch (e) {
        console.error('Error updating task:', e);
        throw new Error('Failed to update task');
    }
}

export async function deleteTask(taskId: string): Promise<string> {
    try{
        const task = await Task.findOne({ _id: taskId });

        if (!task) {
            throw new Error('Task not found');
        }

        task.is_deleted = true;
        task._deleted_at = new Date();
        await task.save();

        return 'Task deleted successfully';
    } catch (e) {
       console.error('Error deleting task:', e);
       throw new Error('Failed to delete task');
    }
}

export async function updateTaskStatus(taskUpdateStatusInput: TaskUpdateStatusInput) {
    try {
        console.log('taskUpdateStatusInput', taskUpdateStatusInput)
        const { taskId, statusId } = taskUpdateStatusInput
        const task = await Task.findOne({_id: taskId});

        if (!task) {
            throw new Error('Task not found');
        }

        task.status = new mongoose.Types.ObjectId(statusId)
        await task.save()
        return 'Task status updated successfully';

    } catch (e) {
        console.error('Error updating task status:', e);
        throw new Error('Failed to update task status');
    }
}

export async function updateTaskPriority(taskUpdatePriorityInput: TaskUpdatePriorityInput) {
    try {
        const { taskId, priorityId } = taskUpdatePriorityInput
        const task = await Task.findOne({_id: taskId});
        if (!task) {
            throw new Error('Task not found');
        }
        task.priority = new mongoose.Types.ObjectId(priorityId)
        await task.save()
        return 'Task priority updated successfully';
    } catch (e) {
        console.error('Error updating task priority:', e);
        throw new Error('Failed to update task priority');
    }
}

export async function userTaskList(userId :string) {
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
            color: task.priority.color
        },
        status: {
            id: task.status._id.toString(),
            name: task.status.name,
            color: task.status.color
        }
    }));
}

