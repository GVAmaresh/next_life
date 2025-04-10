"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatSchema = new mongoose_1.default.Schema({
    sender: { type: String, enum: ["chatbot", "user"], required: true },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: { type: String, required: true },
    createdAt: { type: String, default: Date.now },
    active: { type: Boolean, default: true },
}, { timestamps: true });
const ChatModel = mongoose_1.default.model("Chat", ChatSchema);
exports.default = ChatModel;
//# sourceMappingURL=chatModel.js.map