// src/types.ts (optional file to store type definitions)

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LangflowOutput {
  message?: string; // The text from the AI
  // ... you can add other fields if needed
}

export interface LangflowResponse {
  outputs?: {
    outputs?: {
      messages?: LangflowOutput[];
    }[];
  }[];
}
