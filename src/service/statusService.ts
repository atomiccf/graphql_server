import { Status } from '@models/status.js';

export async function createStatus(name: string, color: string): Promise<string> {
    try {
        const existingStatus = await Status.findOne({ name });
        if (existingStatus) {
            throw new Error('Status already exists');
        }
        const newStatus = new Status({ name, color });
        await newStatus.save();
        return 'Status created successfully';
    } catch (error) {
        console.error('Error creating status:', error);
        throw new Error('Failed to create status');
    }

}
