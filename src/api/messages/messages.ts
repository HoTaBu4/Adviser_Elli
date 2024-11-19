import { Question } from "../../store/types/MessagesType";
import { client } from "../fetchClient";

export const createMessageByGuest = (chatId: number, request) => {
  return client.post(`/chats/${chatId}/guest/message/`, request);
};

export const createMessageByUser = (chatId: number, obj: Question) => {
  return client.post(`/chats/${chatId}/message/`, obj);
};

export const getSavedMassage = (savedMessageId: number) => {
  return client.get(`/saved/${savedMessageId}/`);
};

export const deleteSavedMessage = (messageId: number) => {
  return client.delete(`/saved/${messageId}/delete`);
};

export const deleteAllSavedMessages = () => {
  return client.delete("/saved/delete");
};

export const saveUnsaveMessage = (
  chatId: number,
  messageId: number,
  value: boolean = false,
) => {
  return client.get(`/${chatId}/message/${messageId}/?save=${value}`);
};

export const getAllSavedMessages = () => {
  return client.get("/messages/saved");
};

export const getSavedMessage = (messageId: number) => {
  return client.get(`/saved/${messageId}/`);
};
