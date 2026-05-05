/* eslint-disable no-case-declarations */
import { Reducer } from "react";
import { CommentListAvailableAction, CommentActions } from "./types";
import { CommentListState } from "./types";

export const initialState: CommentListState = {
  comments: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
};

export const commentReducer: Reducer<CommentListState, CommentActions> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case CommentListAvailableAction.FETCH_COMMENTS_REQUEST:
      return { ...state, isLoading: true };
    case CommentListAvailableAction.FETCH_COMMENTS_SUCCESS:
      return { ...state, isLoading: false, comments: action.payload };
    case CommentListAvailableAction.FETCH_COMMENTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload,
      };

    case CommentListAvailableAction.CREATE_COMMENT_REQUEST:
      return { ...state, isLoading: true };
    case CommentListAvailableAction.CREATE_COMMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        comments: [...state.comments, action.payload],
      };

    case CommentListAvailableAction.CREATE_COMMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.payload,
      };
    case CommentListAvailableAction.REORDER_COMMENTS:
      return { ...state, isLoading: false, comments: action.payload };
    default:
      return state;
  }
};
