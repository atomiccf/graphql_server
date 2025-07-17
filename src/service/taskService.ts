import { Task } from '@models/tasks.js';
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
