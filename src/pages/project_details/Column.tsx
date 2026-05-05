/* eslint-disable @typescript-eslint/no-unused-vars */
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";
import React, { forwardRef } from "react";

import { ColumnData, TaskDetails } from "../../context/task/types";

const Container = (props: React.PropsWithChildren) => {
  // We will use flex to display lists as columns
  return (
    <div className="m-2 border border-gray dark:border-slate-700 rounded w-1/3 flex flex-col bg-slate-50 dark:bg-slate-900/50 transition-colors">
      {props.children}
    </div>
  );
};

// A component to render the title, which will be included as <Title>This is a sample title</Title>
const Title = (props: React.PropsWithChildren) => {
  return <h3 className="p-2 font-semibold text-slate-800 dark:text-white">{props.children}</h3>;
};

const TaskList = forwardRef<HTMLDivElement | null, React.PropsWithChildren>(
  (props: React.PropsWithChildren, ref) => {
    return (
      <div ref={ref} className="grow min-h-100 dropArea" {...props}>
        {" "}
        {props.children}
      </div>
    );
  },
);

interface Props {
  column: ColumnData;
  tasks: TaskDetails[];
}

const Column: React.FC<Props> = (props) => {
  return (
    <Container>
      <Title>{props.column.title}</Title>
      <Droppable droppableId={props.column.id}>
        {(provided) => (
          <TaskList ref={provided.innerRef} {...provided.droppableProps}>
            {props.tasks.map((task, idx) => (
              <Task key={task.id} task={task} index={idx} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
};

export default Column;
