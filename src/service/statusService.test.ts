import { Status } from '@models/status.js';
import { createStatus } from '@service/statusService.js';
import { expect } from "@jest/globals";


jest.mock('@models/status.js', () => ({
    Status: jest.fn().mockImplementation(() => ({
        save: jest.fn(),
        findOne: jest.fn(),
    })),
}));

const MockedStatus = Status as jest.MockedClass<typeof Status>;

describe('createStatus service test', () => {
    const mockFindOne = jest.fn();

    beforeAll(() => {
        (MockedStatus as any).findOne = mockFindOne;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should create status successfully when status does not exist', async () => {
        const name = 'High';
        const color = '#FF0000';
        const mockSave = jest.fn().mockResolvedValue(undefined);

        MockedStatus.mockImplementation(() => ({
            save: mockSave
        }) as any);

        const result = await createStatus(name, color);

        expect(mockFindOne).toHaveBeenCalledWith({name});
        expect(MockedStatus).toHaveBeenCalledWith({name, color});
        expect(mockSave).toHaveBeenCalled();
        expect(result).toBe('Status created successfully');

    });

    it('should throw error when status already exists', async () => {
        const name = 'High';
        const color = '#FF0000';
        const existingStatus = {name, color};
        mockFindOne.mockResolvedValue(existingStatus);

        await expect(createStatus(name, color)).rejects.toThrow('Failed to create status');
        expect(mockFindOne).toHaveBeenCalledWith({name});
        expect(MockedStatus).not.toHaveBeenCalled();
    });

    it('should throw error when database save fails', async () => {

        const name = 'Medium';
        const color = '#FFFF00';
        mockFindOne.mockRejectedValue(new Error('Database connection error'));

        await expect(createStatus(name, color)).rejects.toThrow('Failed to create status');
        expect(mockFindOne).toHaveBeenCalledWith({name});
        expect(MockedStatus).not.toHaveBeenCalled();

    });
});
