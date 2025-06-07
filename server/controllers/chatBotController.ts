import { Request, Response } from "express";
import ChatModel from "../models/chatModel";
// import { timeStamp } from "console";

import * as grpc from "@grpc/grpc-js";
// import * as protoLoader from "@grpc/proto-loader";

interface AIService extends grpc.Client {
  GetAIResponse: (
    data: { question: string },
    callback: (
      error: grpc.ServiceError | null,
      response: { answer: string }
    ) => void
  ) => void;
}

// const packageDefinition = protoLoader.loadSync("proto/ai_service.proto", {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });

// const aiProto = grpc.loadPackageDefinition(packageDefinition) as unknown as {
//   ai: {
//     AIService: new (
//       address: string,
//       credentials: grpc.ChannelCredentials
//     ) => AIService;
//   };
// };

// const client = new aiProto.ai.AIService(
//   "localhost:50051",
//   grpc.credentials.createInsecure()
// );

export const createChat = async (req: Request, res: Response) => {
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
    // let aimessage = await new Promise<string>((resolve, reject) => {
    //   client.GetAIResponse(
    //     { question: message },
    //     (error: any, response: any) => {
    //       if (error) {
    //         console.error("gRPC error:", error);
    //         return reject(error);
    //       }
    //       resolve(response.answer);
    //     }
    //   );
    // });

    if (!aimessage) aimessage = "Problem in the chatbot api key"

    console.log(aimessage);
    const newUserChat = new ChatModel({ sender: "user", message, userId });
    await newUserChat.save();

    const newAIChat = new ChatModel({
      sender: "chatbot",
      message: aimessage,
      userId,
    });
    await newAIChat.save();

    return res.status(201).json({
      message: "Chat stored successfully",
      data: {
        text: aimessage,
        timeStamp: Date.now(),
      },
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllchat = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const userId = user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 25;
    const skip = (page - 1) * limit;

    let chats = await ChatModel.find({ userId, active: true })
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
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const userId = user._id;
    const { createdAt } = req.body;

    const chat = await ChatModel.findOne({ userId, createdAt, active: true });

    if (!chat) {
      return res
        .status(200)
        .json({ message: "Chat is already deleted or not found" });
    }

    chat.active = false;
    await chat.save();

    return res.status(200).json({ message: "Chat successfully deleted" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
