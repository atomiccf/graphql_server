import { Priority } from '@models/priority.js';

export async function createPriority(name: string, color: string): Promise<string> {
    try {
        const existingPriority = await Priority.findOne({ name });
        if (existingPriority) {
            throw new Error('Priority already exists');
        }
        const newPriority = new Priority({
            name,
            color: color.toUpperCase()
        });
        await newPriority.save();
        return 'Priority created successfully';
    } catch (error) {
        console.error('Error creating priority:', error);
        throw new Error('Failed to create priority');
    }
}

export async function updatePriority(_id: string, name: string, color: string): Promise<string> {
    try {
        const existingPriority = await Priority.findOne({ _id:_id });
        if (!existingPriority) {
            throw new Error('Priority not found');
        }

        if (!name && !color) {
            return 'Nothing to update';
        }

        if (name !== undefined) existingPriority.name = name;
        if (color !== undefined) existingPriority.color = color;


        await existingPriority.save();
        return 'Priority updated successfully';
    } catch (error) {
        console.error('Error updating priority:', error);
        throw new Error('Failed to update priority');
    }
}

export async function deletePriority(_id: string): Promise<string> {
    try {
        const existingPriority = await Priority.findOne({ _id: _id });
        if (!existingPriority) {
            throw new Error('Priority not found');
        }
        existingPriority.is_deleted = true;
        await existingPriority.save();
        return 'Priority deleted successfully';
    } catch (error) {
        console.error('Error deleting priority:', error);
        throw new Error('Failed to delete priority');
    }

}
