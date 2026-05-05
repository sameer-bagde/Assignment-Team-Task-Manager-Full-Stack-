/* eslint-disable @typescript-eslint/no-explicit-any */
// Import required type annotations
import { API_ENDPOINT } from "../../config/constants";
import {
  CommentData,
  CommentDetailsPayload,
  CommentListAvailableAction,
  CommentsDispatch,
} from "./types";

// The function will take a dispatch as first argument, which can be used to send an action to `reducer` and update the state accordingly
export const addComment = async (
  dispatch: CommentsDispatch,
  projectID: string,
  taskID: string,
  comment: CommentDetailsPayload,
) => {
  const token = localStorage.getItem("authToken") ?? "";
  try {
    dispatch({ type: CommentListAvailableAction.CREATE_COMMENT_REQUEST });
    const response = await fetch(
      `${API_ENDPOINT}/projects/${projectID}/tasks/${taskID}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(comment),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to create commnet");
    }
    const data = await response.json();
    console.log("Raw Response:", response);

    dispatch({
      type: CommentListAvailableAction.CREATE_COMMENT_SUCCESS,
      payload: data,
    });
    console.log("comment successfully", data);
  } catch (error) {
    console.error("Operation failed:", error);
    dispatch({
      type: CommentListAvailableAction.CREATE_COMMENT_FAILURE,
      payload: "Unable to create comment",
    });
  }
};

export const reorderComments = (
  dispatch: CommentsDispatch,
  newState: CommentData,
) => {
  dispatch({
    type: CommentListAvailableAction.REORDER_COMMENTS,
    payload: newState,
  });
};

export const fetchComments = async (
  dispatch: CommentsDispatch,
  projectID: string,
  taskID: string,
) => {
  const token = localStorage.getItem("authToken") ?? "";

  try {
    dispatch({ type: CommentListAvailableAction.FETCH_COMMENTS_REQUEST });
    const response = await fetch(
      `${API_ENDPOINT}/projects/${projectID}/tasks/${taskID}/comments`,
      {
        headers: {
          method: "GET",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    const data = await response.json();
    console.log(data); // Add this line
    dispatch({
      type: CommentListAvailableAction.FETCH_COMMENTS_SUCCESS,
      payload: data,
    });
    console.dir(data);
  } catch (error) {
    console.log("Error fetching users:", error);
    dispatch({
      type: CommentListAvailableAction.FETCH_COMMENTS_FAILURE,
      payload: "Unable to load comments",
    });
  }
};
