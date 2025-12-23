import { model, Schema } from "mongoose";
import type { ConversationProps } from "../types.js";

const ConversationSchema = new Schema<ConversationProps>(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    name: String,
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    avatar: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true, // ✅ Use built-in timestamps instead of manual
  }
);

// ✅ Remove this - using timestamps: true instead
// ConversationSchema.pre("save", function(next){
//     this.updatedAt = new Date();
//     next();
// });

export default model<ConversationProps>("Conversation", ConversationSchema);