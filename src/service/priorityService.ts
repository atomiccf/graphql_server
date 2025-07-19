import { Priority } from '@models/priority.js';

export async function createPriority(name: unknown, color: string): Promise<string> {
    try {
        const existingPriority = await Priority.findOne({ name });
        if (existingPriority) {
            throw new Error('Priority already exists');
        }
        const newPriority = new Priority({ name, color });
        await newPriority.save();
        return 'Priority created successfully';
    } catch (error) {
        console.error('Error creating priority:', error);
        throw new Error('Failed to create priority');
    }
}
