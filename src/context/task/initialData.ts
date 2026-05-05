import { ProjectData } from "./types";

const initialData: ProjectData = {
  columns: {
    pending: {
      id: "pending",
      title: "Pending",
      taskIDs: [],
    },
    in_progress: {
      id: "in_progress",
      title: "In progress",
      taskIDs: [],
    },
    done: {
      id: "done",
      title: "Done",
      taskIDs: [],
    },
  },
  tasks: {},
  columnOrder: ["pending", "in_progress", "done"],
};

export default initialData;
