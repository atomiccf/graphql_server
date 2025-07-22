import { createPriority } from '@service/priorityService.js';
import { Priority } from '@models/priority.js';

jest.mock('@models/priority.js', () => ({
    Priority: jest.fn().mockImplementation(() => ({
        save: jest.fn()
    }))
}));

const MockedPriority = Priority as jest.MockedClass<typeof Priority>;

describe('createPriority', () => {

    const mockFindOne = jest.fn();

    beforeAll(() => {
        (MockedPriority as any).findOne = mockFindOne;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Positive scenario', () => {
        it('should create priority successfully when priority does not exist', async () => {

            const name = 'High';
            const color = '#FF0000';
            const mockSave = jest.fn().mockResolvedValue(undefined);

            mockFindOne.mockResolvedValue(null);
            MockedPriority.mockImplementation(() => ({
                save: mockSave
            }) as any);


            const result = await createPriority(name, color);


            expect(mockFindOne).toHaveBeenCalledWith({ name });
            expect(MockedPriority).toHaveBeenCalledWith({ name, color });
            expect(mockSave).toHaveBeenCalled();
            expect(result).toBe('Priority created successfully');
        });
    });

    describe('Negative scenarios', () => {
        it('should throw error when priority already exists', async () => {

            const name = 'High';
            const color = '#FF0000';
            const existingPriority = { name, color };
            mockFindOne.mockResolvedValue(existingPriority);


            await expect(createPriority(name, color)).rejects.toThrow('Failed to create priority');
            expect(mockFindOne).toHaveBeenCalledWith({ name });
            expect(MockedPriority).not.toHaveBeenCalled();
        });

        it('should throw error when database save fails', async () => {
            // Arrange
            const name = 'Medium';
            const color = '#FFFF00';
            const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));

            mockFindOne.mockResolvedValue(null);
            MockedPriority.mockImplementation(() => ({
                save: mockSave
            }) as any);


            await expect(createPriority(name, color)).rejects.toThrow('Failed to create priority');
            expect(mockFindOne).toHaveBeenCalledWith({ name });
            expect(MockedPriority).toHaveBeenCalledWith({ name, color });
            expect(mockSave).toHaveBeenCalled();
        });

        it('should throw error when findOne fails', async () => {

            const name = 'Low';
            const color = '#00FF00';
            mockFindOne.mockRejectedValue(new Error('Database connection error'));


            await expect(createPriority(name, color)).rejects.toThrow('Failed to create priority');
            expect(mockFindOne).toHaveBeenCalledWith({ name });
            expect(MockedPriority).not.toHaveBeenCalled();
        });
    });
});
