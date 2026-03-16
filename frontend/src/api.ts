import axios from "axios";
import { Task, CreateTaskDTO } from "./types";

const API = axios.create({
  baseURL: "https://week4day1-w3yt.vercel.app/api",
});

export const getTasks = async (): Promise<Task[]> => {
  const res = await API.get<Task[]>("/tasks");
  return res.data;
};

export const createTask = async (data: CreateTaskDTO): Promise<Task> => {
  const res = await API.post<Task>("/tasks", data);
  return res.data;
};

export const toggleTask = async (id: number): Promise<Task> => {
  const res = await API.put<Task>(`/tasks/${id}`);
  return res.data;
};

export const removeTask = async (id: number): Promise<void> => {
  await API.delete(`/tasks/${id}`);
};
