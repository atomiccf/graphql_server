import { Task } from '@models/tasks.js';
import { saveUploadedFile } from '@utils/fileUpload.js';
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

    const existingTask = await Task.findOne({ title });
    if (existingTask) {
        throw new Error('Task already exists');
    }

    const imagePath = image ? await saveUploadedFile(image, userId) : null;

    const newTask = new Task({
        title,
        description,
        priority,
        image: imagePath,
        _created_by: userId,
        _created_at: new Date(date),
    });

    await newTask.save();
    return 'Task created successfully';
}
