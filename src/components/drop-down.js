import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const onDragEnd = (result) => {
  if (!result.destination) return;
  const items = Array.from(tasks);
  const [reorderedItem] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reorderedItem);
  setTasks(items);
};

const DropDown = () => {

return (
<DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId="tasks">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef}>
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {task.title}
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
)
}

export default DropDown;