export class ApiError extends Error {
    level: string = 'error';
    constructor(message: string, level: string = 'error') {
        super(message);
        this.level = level;
    }
}