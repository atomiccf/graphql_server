import { Types } from 'mongoose';
import { Task} from '@models/tasks.js';
import { Priority } from '@models/priority.js';
import { Status } from "@models/status.js";
import { saveUploadedFile } from '@utils/fileUpload.js';
import { createImagePublicUrl } from "@utils/createImagePublicUrl.js";
import type { File } from '@graphql/types/taskInput.js';

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
}

export async function deleteTask(taskId: string): Promise<string> {
    console.log('taskId_service', taskId);
    const task = await Task.findOne({ _id: taskId });

    if (!task) {
        throw new Error('Task not found');
    }

    task.is_deleted = true;
    task._deleted_at = new Date();
    await task.save();

    return 'Task deleted successfully';
}
