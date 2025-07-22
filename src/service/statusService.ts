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

export async function updateStatus( _id: string, name: string, color: string ): Promise<string> {
    try {
        const existingStatus = await Status.findOne({_id: _id });
        if (!existingStatus) {
            throw new Error('Status not found');
        }

        if (!name && !color) {
            return 'Nothing to update';
        }

        if (name !== undefined) existingStatus.name = name;
        if (color !== undefined) existingStatus.color = color;
        await existingStatus.save();
        return 'Status updated successfully';
    } catch (error) {
        console.error('Error updating status:', error);
        throw new Error('Failed to update status');
    }
}

export async function deleteStatus(_id: string): Promise<string> {
    try {
        const existingStatus = await Status.findOne({ _id: _id });
        if (!existingStatus) {
            throw new Error('Status not found');
        }

        existingStatus.is_deleted = true;
        await existingStatus.save();
        return 'Status deleted successfully';
    } catch (error) {
        console.error('Error deleting status:', error);
        throw new Error('Failed to delete status');
    }
}
