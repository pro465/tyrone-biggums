import WebSocket from "ws";
import EventEmitterBecausePeopleToldMeItWasDogShit from "../event-emitter-because-people-told-me-it-was-dogshit";
import { createMessage, Message } from "../message";

export interface Socket {
    // Events
    push(data: object): Promise<void>;

    on(event: "error", cb: (error: Error) => void): void;
    on(event: "message", cb: (msg: Message) => void): void;
    on(event: "close", cb: () => void): void;
}

export default class SocketImpl extends EventEmitterBecausePeopleToldMeItWasDogShit implements Socket {
    constructor(private socket: WebSocket) {
        super();

        this.socket.on("message", (msg) => {
            this.emit("message", createMessage(msg.toString()));
        });

        this.socket.on("close", () => {
            this.emit("close");
        });

        this.socket.on("error", (e: Error) => {
            this.emit("error", e);
        });
    }

    close(code?: number): void {
        this.socket.close(code);
    }

    push(data: object): Promise<void> {
        return new Promise((res, rej) => {
            this.socket.send(JSON.stringify(data), (err?: Error) => {
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            });
        })
    }
}
