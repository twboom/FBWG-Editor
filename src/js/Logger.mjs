export default class Logger {
    /**
     * 
     * @param {string} name 
     * @param {string} sessionId 
     */
    constructor(name, sessionId) {
        this.name = name;
        this.sessionId = sessionId;
        this.messages = [];
    }

    /**
     * Add a message to the logger.
     * @param {Message} message_obj The message object to add.
     */
    addMessage(message_obj) {
        if (message_obj instanceof Message) {

        } else {
            throw new TypeError("'message_obj' was not an instanceof 'Message'.")
        };
    };

    // Shorthand functions
    /**
     * Shorthand function to add action message to the logger.
     * @param {string} message String containing the message.
     * @param {string} sender String containing a sender ID.
     */
    action(message, sender) {
        this.addMessage(new ActionMessage(message, sender));
    };

    /**
     * Shorthand function to add information message to the logger.
     * @param {string} message String containing the message.
     * @param {string} sender String containing a sender ID.
     */
    info(message, sender) {
        this.addMessage(new InformationMessage(message, sender));
    };

    /**
     * Shorthand function to add warning message to the logger.
     * @param {string} message String containing the message.
     * @param {string} sender String containing a sender ID.
     */
    warn(message, sender) {
        this.addMessage(new WarningMessage(message, sender));
    };

    /**
     * Shorthand function to add error message to the logger.
     * @param {string} message String containing the message.
     * @param {string} sender String containing a sender ID.
     */
    error(message, sender) {
        this.addMessage(new ErrorMessage(message, sender));
    };
};

class Message {
    /** * Allowed message types. */
    TYPES = [
        'action',
        'information',
        'warning',
        'error',
    ]

    /** Correct console output functions per message type. */
    #consoleAction = {
        'action': console.log,
        'information': console.info,
        'warning': console.warn,
        'error': console.error,
    };

    /**
     * Create a new generic message.
     * @param {string} type Type of the message, allowed types are 'action', 'information', 'warning' and 'error'.
     * @param {string} message String containing the message.
     * @param {string} sender String containing a sender ID.
     */
    constructor(type, message, sender) {
        if (!this.TYPES.includes(type)) {
            throw new TypeError("'type' was not a valid message type.")
        };
        this.type = type;
        this.message = message;
        this.sender = sender;
    };

    /**
     * Get a formatted string for this message.
     * @return {string} 
    */
    get formatted() {
        return `[${this.type.toUpperCase()}] (${this.sender}) ${this.message}`;
    };

    /**
     * Outputs the message to the console.
     */
    output() {
        [this.#consoleAction[this.type]](this.formatted)
    };
};

class ActionMessage extends Message {
    /**
     * Create a new message with the 'action' type.
     * @param {string} message 
     * @param {string} sender 
     */
    constructor(message, sender) {
        super('action', message, sender);
    };
};

class InformationMessage extends Message {
    /**
     * Create a new message with the 'information' type.
     * @param {string} message 
     * @param {string} sender 
     */
    constructor(message, sender) {
        super('information', message, sender);
    };
};

class WarningMessage extends Message {
    /**
     * Create a new message with the 'warning' type.
     * @param {string} message 
     * @param {string} sender 
     */
    constructor(message, sender) {
        super('warning', message, sender);
    };
};

class ErrorMessage extends Message {
    /**
     * Create a new message with the 'error' type.
     * @param {string} message 
     * @param {string} sender 
     */
    constructor(message, sender) {
        super('error', message, sender);
    };
};
