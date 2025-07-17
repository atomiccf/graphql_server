import { Status } from '@models/status.js';
import { createStatus } from "@service/statusService.js";
import { StatusInput } from "@graphql/types/statusInput.js";

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
        addStatus: async (_: unknown, { statusInput }: { statusInput: StatusInput }) => {
            try {
                const { name, color } = statusInput.statusInput;
                const existingStatus = await Status.findOne({ name });
                if (existingStatus) {}
                await createStatus(name, color);

            } catch (error) {
                console.error('Error creating status:', error);
                throw new Error('Failed to create status');
            }
        }
    }
};
