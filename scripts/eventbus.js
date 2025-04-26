import { isLocal } from './constants.js';

class EventBus {
    constructor() {
        this.eventObject = {};
        this.callbackId = 0;
    }

    publish(eventName, ...args) {
        const callbackObject = this.eventObject[eventName];

        if (!callbackObject && isLocal()) {
            return console.warn(eventName + " not found!");
        }

        for (let id in callbackObject) {
            callbackObject[id](...args);
        }
    }

    subscribe(eventName, callback) {
        if (!this.eventObject[eventName]) {
            this.eventObject[eventName] = {};
        }

        const id = this.callbackId++;
        this.eventObject[eventName][id] = callback;
    }
}

const eventBus = new EventBus();
export default eventBus;