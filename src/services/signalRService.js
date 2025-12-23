import * as signalR from "@microsoft/signalr";
import { API_URLS } from "@/api/api.url";

class SignalRService {
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(API_URLS.SIGNALR_URL, {
                accessTokenFactory: () => localStorage.getItem("token")
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.startPromise = null;
    }

    async startConnection() {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            return;
        }

        if (!this.startPromise) {
            this.startPromise = this.connection.start()
                .then(() => {
                    console.log("SignalR connection established");
                })
                .catch(err => {
                    this.startPromise = null;
                    console.error("Error establishing SignalR connection:", err);
                    throw err;
                });
        }

        return this.startPromise;
    }

    async stopConnection() {
        this.startPromise = null;
        return this.connection.stop();
    }

    async connectionRoom(room_id) {
        await this.startConnection();
        return this.connection.invoke("JoinRoomChat", room_id);
    }

    onReceiveRoom(callback) {
        this.connection.on("ReceiveGroupInvite", async (groupId) => {
            try {
                await this.connectionRoom([groupId]);
                callback(groupId);
            } catch (err) {
                console.error(err);
            }
        });
    }

    onReceiveMessage(callback) {
        this.connection.on("ReceiveMessage", callback);
    }

    async sendMessage(message) {
        await this.startConnection();
        return this.connection.invoke("SendMessageAsync", message);
    }

    async createRoomTwo(roomTwoDTO) {
        await this.startConnection();
        return this.connection.invoke("CreateRoomChat", roomTwoDTO);
    }

    async notAcceptFriendship(payload) {
        await this.startConnection();
        return this.connection.invoke("NotAcceptFriendship", payload);
    }

    receiveNotAcceptFriendship(callback) {
        this.connection.on("ReceiveFromNotAcceptFriend", callback);
    }

    async acceptFriendship(payload) {
        await this.startConnection();
        return this.connection.invoke("AcceptFriendship", payload);
    }

    receiveAcceptFriendship(callback) {
        this.connection.on("ReceiveFromAcceptFriend", callback);
    }

    async sendFriend(payload) {
        await this.startConnection();
        return this.connection.invoke("sendFriend", payload);
    }

    receiveFriendship(callback) {
        this.connection.on("ReceiveFromSendFriend", callback);
    }
}

export default new SignalRService();
