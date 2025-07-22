import { Task } from '@models/tasks.js';
import { Priority } from '@models/priority.js';
import { Status } from '@models/status.js';
import { createTask } from '@service/taskService.js';
import { saveUploadedFile } from '@utils/fileUpload.js';
import { createImagePublicUrl } from '@utils/createImagePublicUrl.js';
import type { File } from '@graphql/types/taskInput.js';

jest.mock('@models/priority.js', () => ({
    Priority: {
        findOne: jest.fn()
    }
}));

jest.mock('@models/status.js', () => ({
    Status: {
        findOne: jest.fn()
    }
}));

jest.mock('@models/tasks.js', () => ({
    Task: jest.fn()
}));

jest.mock('@utils/fileUpload.js', () => ({
    saveUploadedFile: jest.fn()
}));

jest.mock('@utils/createImagePublicUrl.js', () => ({
    createImagePublicUrl: jest.fn()
}));

const mockedFile: File = {
    filename: 'test.jpg',
    mimetype: 'image/jpeg',
    encoding: '7bit',
    createReadStream: jest.fn()
};

const MockedTask = Task as jest.MockedClass<typeof Task>;
const MockedPriority = Priority as jest.MockedClass<typeof Priority>;
const MockedStatus = Status as jest.MockedClass<typeof Status>;


describe('createTask service test', () => {
    const mockSave = jest.fn();
    const mockPriorityFindOne = jest.fn();
    const mockStatusFindOne = jest.fn();
    const mockTaskFindOne = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (MockedPriority as any).findOne = mockPriorityFindOne;
        (MockedStatus as any).findOne = mockStatusFindOne;
        (MockedTask as any).findOne = mockTaskFindOne;
        (saveUploadedFile as jest.Mock).mockReset();
        (createImagePublicUrl as jest.Mock).mockReset();


    });

    it('should create task successfully with image', async () => {

        const title = 'Task 1';
        const description = 'Description 1';
        const date = new Date();
        const priority = '1';
        const userId = '1';
        const image = Promise.resolve(mockedFile);


        const priorityResult = { _id: 'priority1' };
        const statusResult = { _id: 'status1' };
        const uploadedPath = 'uploads/user1/test.jpg';
        const publicUrl = 'https://example.com/image1.jpg';

        (Priority.findOne as jest.Mock).mockResolvedValue(priorityResult);
        (Status.findOne as jest.Mock).mockResolvedValue(statusResult);
        (Task as any).findOne = jest.fn().mockResolvedValue(null);
        (saveUploadedFile as jest.Mock).mockResolvedValue(uploadedPath);
        (createImagePublicUrl as jest.Mock).mockReturnValue(publicUrl);
        MockedTask.mockImplementation(() => ({
            save: mockSave
        }) as any);

        const result = await createTask({
            title,
            description,
            date: date.toISOString(),
            priority,
            userId,
            image
        });

        expect(Priority.findOne).toHaveBeenCalledWith({ name: priority });
        expect(Status.findOne).toHaveBeenCalledWith({ name: 'Not Started' });

        expect(MockedTask).toHaveBeenCalledWith({
            title,
            description,
            priority: priorityResult._id,
            status: statusResult._id,
            image: uploadedPath,
            publicUrl,
            _created_by: userId,
            _created_at: new Date(date),
        });

        expect(mockSave).toHaveBeenCalled();
        expect(result).toBe('Task created successfully');
    });
});
