import { Logger } from "./Logger.mjs";

export default class SessionManager {
    constructor() {
        this.startdate = new Date(Date.now());
        this.logger = new Logger('Generic Logger');
        
        this.logger.info('New session started.', 'Session Manager');
    };
};