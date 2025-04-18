"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../../app"));
const chatModel_1 = __importDefault(require("../../models/chatModel"));
const userModel_1 = __importDefault(require("../../models/userModel"));
let mongoServer;
let authToken;
let userId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    yield mongoose_1.default.connect(mongoUri);
    const user = new userModel_1.default({
        userName: "Test User",
        email: "testuser@example.com",
        password: "password123",
        emailVerified: true,
    });
    yield user.save();
    userId = user._id;
    authToken = "mock-auth-token";
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.dropDatabase();
    yield mongoose_1.default.connection.close();
    yield mongoServer.stop();
}));
describe("Chat API Integration Tests", () => {
    let chatCreatedAt;
    it("should create a chat successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const chatData = {
            sender: "Test Sender",
            message: "Hello, this is a test message",
        };
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/chat/create-chat")
            .set("Authorization", `Bearer ${authToken}`)
            .send(chatData);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Chat stored successfully");
        expect(res.body.data.sender).toBe(chatData.sender);
        expect(res.body.data.message).toBe(chatData.message);
        chatCreatedAt = res.body.data.createdAt;
    }));
    it("should return an error if sender or message is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/chat/create-chat")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ sender: "Missing Message" });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Sender or Message is not provided");
    }));
    it("should return an error if user is not authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/chat/create-chat")
            .send({ sender: "Test", message: "Unauthenticated request" });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Unauthorized");
    }));
    it("should retrieve all chats", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/chat/get-chat")
            .set("Authorization", `Bearer ${authToken}`)
            .query({ page: 1 });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Chats retrieved");
        expect(res.body.data.length).toBeGreaterThan(0);
    }));
    it("should return empty array when no chats exist", () => __awaiter(void 0, void 0, void 0, function* () {
        yield chatModel_1.default.deleteMany();
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/chat/get-chat")
            .set("Authorization", `Bearer ${authToken}`)
            .query({ page: 1 });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("No chats available");
        expect(res.body.data).toEqual([]);
    }));
    it("should delete a chat successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const chat = new chatModel_1.default({
            sender: "To Delete",
            message: "This chat will be deleted",
            userId,
            active: true,
            createdAt: new Date(),
        });
        yield chat.save();
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/chat/delete-chat")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ createdAt: chat.createdAt });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Chat successfully deleted");
        const deletedChat = yield chatModel_1.default.findOne({ createdAt: chat.createdAt });
        expect(deletedChat === null || deletedChat === void 0 ? void 0 : deletedChat.active).toBe(false);
    }));
    it("should return error when deleting a non-existent chat", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/chat/delete-chat")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ createdAt: new Date() });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Chat is already deleted or not found");
    }));
    it("should return error when user is not authenticated for deletion", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/chat/delete-chat")
            .send({ createdAt: new Date() });
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Unauthorized");
    }));
});
//# sourceMappingURL=chatbotRoute.test.js.map