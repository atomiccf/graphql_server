export interface StatusInput {
    statusInput: {
        name: string;
        color: string;
    }
}

export interface UpdateStatusInput {
    updateInput: {
        _id: string;
        name: string;
        color: string;
    }
}
