"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteChat = exports.getAllchat = exports.createChat = void 0;
const chatModel_1 = __importDefault(require("../models/chatModel"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
// const packageDefinition = protoLoader.loadSync("ai_service.proto", {
//     keepCase: true,
//     longs: String,
//     enums: String,
//     defaults: true,
//     oneofs: true,
// });
// const aiProto = grpc.loadPackageDefinition(packageDefinition);
// const client = new aiProto.ai.AIService("localhost:50051", grpc.credentials.createInsecure());
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const userId = user._id;
        const { text: message } = req.body;
        if (!message) {
            return res.status(400).json({ message: " Message is not provided" });
        }
        console.log(message);
        let aimessage = ""
        // let aimessage = yield new Promise((resolve, reject) => {
        //     client.GetAIResponse({ question: message }, (error, response) => {
        //         if (error) {
        //             console.error("gRPC error:", error);
        //             return reject(error);
        //         }
        //         resolve(response.answer);
        //     });
        // });
        if (!aimessage)
            aimessage = "Problem in the chatbot api key";
        console.log(aimessage);
        const newUserChat = new chatModel_1.default({ sender: "user", message, userId });
        yield newUserChat.save();
        const newAIChat = new chatModel_1.default({
            sender: "chatbot",
            message: aimessage,
            userId,
        });
        yield newAIChat.save();
        return res.status(201).json({
            message: "Chat stored successfully",
            data: {
                text: aimessage,
                timeStamp: Date.now(),
            },
        });
    }
    catch (error) {
        console.error("Error creating chat:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.createChat = createChat;
const getAllchat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const userId = user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = 25;
        const skip = (page - 1) * limit;
        let chats = yield chatModel_1.default.find({ userId, active: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        if (chats.length === 0) {
            return res.status(200).json({ message: "No chats available", data: [] });
        }
        chats = chats.reverse();
        const filteredChats = chats.map((chat) => ({
            sender: chat.sender,
            text: chat.message,
            timestamp: parseInt(chat.createdAt),
        }));
        return res
            .status(200)
            .json({ message: "Chats retrieved", data: filteredChats });
    }
    catch (error) {
        console.error("Error fetching chats:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllchat = getAllchat;
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = res.locals.user;
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const userId = user._id;
        const { createdAt } = req.body;
        const chat = yield chatModel_1.default.findOne({ userId, createdAt, active: true });
        if (!chat) {
            return res
                .status(200)
                .json({ message: "Chat is already deleted or not found" });
        }
        chat.active = false;
        yield chat.save();
        return res.status(200).json({ message: "Chat successfully deleted" });
    }
    catch (error) {
        console.error("Error deleting chat:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteChat = deleteChat;
//# sourceMappingURL=chatBotController.js.map