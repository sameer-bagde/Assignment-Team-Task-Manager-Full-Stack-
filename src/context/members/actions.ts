import { API_ENDPOINT } from "../../config/constants";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchMembers = async (dispatch: any) => {
  const token = localStorage.getItem("authToken") ?? "";

  try {
    dispatch({ type: "FETCH_MEMBERS_REQUEST" });
    const response = await fetch(`${API_ENDPOINT}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data); // Add this line
    dispatch({ type: "FETCH_MEMBERS_SUCCESS", payload: data });
  } catch (error) {
    console.log("Error fetching users:", error);
    dispatch({
      type: "FETCH_MEMBERS_FAILURE",
      payload: "Unable to load users",
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addMembers = async (dispatch: any, args: any) => {
  try {
    const token = localStorage.getItem("authToken") ?? "";
    const response = await fetch(`${API_ENDPOINT}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      // Next, I'll pass the `args` here
      body: JSON.stringify(args),
    });
    if (!response.ok) {
      throw new Error("Failed to add member");
    }
    const data = await response.json();
    if (data.errors && data.errors.length > 0) {
      return { ok: false, error: data.errors[0].message };
    }

    dispatch({ type: "ADD_MEMBERS_SUCCESS", payload: data });

    return { ok: true };
  } catch (error) {
    console.error("Operation failed:", error);
    return { ok: false, error };
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const removeMember = async (dispatch: any, id: number) => {
  const token = localStorage.getItem("authToken") ?? "";
  console.log(`Removing member with ID: ${id}`);

  try {
    dispatch({ type: "REMOVE_MEMBERS_REQUEST" });

    const response = await fetch(`${API_ENDPOINT}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      dispatch({ type: "REMOVE_MEMBERS_SUCCESS", payload: data });
      return { ok: true };
    } else {
      throw new Error("Failed to remove member");
    }
  } catch (error) {
    console.error("Operation failed:", error);
    return { ok: false, error };
  }
};
