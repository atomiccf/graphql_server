import { Status } from '@models/status.js';
import {createStatus, deleteStatus, updateStatus} from "@service/statusService.js";
import {StatusInput, UpdateStatusInput} from "@graphql/types/statusInput.js";

export const statusResolvers = {
    Query: {
        getAllStatus: async () => {
            try {
                return await Status.find();
            }catch (e) {
                throw new Error('Failed to fetch status');
            }

        }
    },

    Mutation: {
        addStatus: async (_: unknown, { statusInput }: StatusInput) => {
            try {
                const { name, color } = statusInput;
                return await createStatus(name, color);
            } catch (error) {
                console.error('Error creating status:', error);
                throw new Error('Failed to create status');
            }
        },
        updateStatus: async (_: unknown, { updateInput }: UpdateStatusInput) => {
            console.log('updateInput', updateInput);
            try {
                const { _id, name, color } = updateInput;
                return await updateStatus(_id , name, color);
            } catch (error) {
                console.error('Error updating status:', error);
                throw new Error('Failed to update status');
            }
        },
        deleteStatus: async (_: unknown, { _id }: { _id: string }) => {
            try {
                return await deleteStatus(_id);
            } catch (error) {
                console.error('Error deleting status:', error);
                throw new Error('Failed to delete status');
            }
        }
    }
};
