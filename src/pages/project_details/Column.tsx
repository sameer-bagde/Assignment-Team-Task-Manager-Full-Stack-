/* eslint-disable @typescript-eslint/no-unused-vars */
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";
import React, { forwardRef } from "react";

import { ColumnData, TaskDetails } from "../../context/task/types";

const Container = (props: React.PropsWithChildren) => {
  // We will use flex to display lists as columns
  return (
    <div className="mx-2 my-4 w-1/3 flex flex-col bg-slate-100/50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200/50 dark:border-slate-800/80 transition-colors shadow-sm overflow-hidden">
      {props.children}
    </div>
  );
};

// A component to render the title
const Title = (props: React.PropsWithChildren) => {
  return <h3 className="px-5 py-4 font-semibold text-sm tracking-wide uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200/50 dark:border-slate-800/50">{props.children}</h3>;
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
