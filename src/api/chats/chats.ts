import { createChatType } from "../../assets/types/chat";
import { client } from "../fetchClient";

export const createChat = (data: createChatType) => {
  return client.post("/chats/create/", data);
};

export const getAllChats = () => {
  return client.get("/chats/");
};

export const delChat = (chatId: number) => {
  return client.delete(`/chats/${chatId}/delete/`);
};

export const delAllChats = () => {
  return client.delete("/chats/delete/");
};

export const saveChatItem = (chatId: number) => {
  return client.post(`/chats/${chatId}`, true);
};

export const unsaveChatItem = (chatId: number) => {
  return client.post(`/chats/${chatId}`, false);
};

export const retrieveChat = (chatId: number) => {
  return client.get(`/chats/${chatId}/`);
};
