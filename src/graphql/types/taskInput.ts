export type File = {
    filename:string,
    mimetype:string,
    encoding:string,
    createReadStream: () => NodeJS.ReadableStream;
}

export type FilePromise = Promise<File>;

export type taskInput = {
    taskInput:{
        title: string,
        description: string,
        date: string,
        priority: string,
        userId: string,
        image: FilePromise
    }
}

export type taskUpdateInput = {
    taskUpdateInput: {
        taskId: string,
        title: string,
        description: string,
        date: string,
        priority: string,
        userId: string,
        image: FilePromise
    }
}

export type TaskUpdateStatusInput = {
        taskId: string,
        statusId: string
}

export type TaskUpdatePriorityInput = {
        taskId: string,
        priorityId: string,
}
