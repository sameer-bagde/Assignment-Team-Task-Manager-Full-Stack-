export interface CommentListState {
  comments: CommentData;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
}
export type CommentData = CommentDetails[];

export type User = {
  id: number;
  name: string;
  email: string;
};

export type CommentDetails = {
  id: number;
  User: User;
  description: string;
  createdAt: string;
  owner: number;
};

export type CommentDetailsPayload = Omit<
  CommentDetails,
  "id" | "User" | "owner" | "createdAt"
>;

export enum CommentListAvailableAction {
  FETCH_COMMENTS_REQUEST = "FETCH_COMMENTS_REQUEST",
  FETCH_COMMENTS_SUCCESS = "FETCH_COMMENTS_SUCCESS",
  FETCH_COMMENTS_FAILURE = "FETCH_COMMENTS_FAILURE",

  CREATE_COMMENT_REQUEST = "CREATE_COMMENT_REQUEST",
  CREATE_COMMENT_SUCCESS = "CREATE_COMMENT_SUCCESS",
  CREATE_COMMENT_FAILURE = "CREATE_COMMENT_FAILURE",

  REORDER_COMMENTS = "REORDER_COMMENTS",
}

export type CommentActions =
  | { type: CommentListAvailableAction.REORDER_COMMENTS; payload: CommentData }
  | { type: CommentListAvailableAction.FETCH_COMMENTS_REQUEST }
  | {
      type: CommentListAvailableAction.FETCH_COMMENTS_SUCCESS;
      payload: CommentData;
    }
  | { type: CommentListAvailableAction.FETCH_COMMENTS_FAILURE; payload: string }
  | { type: CommentListAvailableAction.CREATE_COMMENT_REQUEST }
  | {
      type: CommentListAvailableAction.CREATE_COMMENT_SUCCESS;
      payload: CommentDetails;
    }
  | {
      type: CommentListAvailableAction.CREATE_COMMENT_FAILURE;
      payload: string;
    };

// A type to hold dispatch actions in a context.
export type CommentsDispatch = React.Dispatch<CommentActions>;
