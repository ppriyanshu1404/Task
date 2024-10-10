import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [groupBy, setGroupBy] = useState('user');
  const [sortOrder, setSortOrder] = useState('priority'); // New state for sorting

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
      setTasks(result.data.tickets);
      setFilteredTasks(result.data.tickets);
    };
    fetchData();
  }, []);

  const handleGroupChange = (event) => {
    const group = event.target.value;
    setGroupBy(group);
    let groupedTasks = [...tasks];

    if (group === 'user') {
      groupedTasks.sort((a, b) => a.userId.localeCompare(b.userId));
    } else if (group === 'status') {
      groupedTasks.sort((a, b) => a.status.localeCompare(b.status));
    }
    else if (group === 'priority') {
      const groupedByPriority = tasks.sort((a, b) => a.priority - b.priority);
      setFilteredTasks([...groupedByPriority]);
    }

    applySorting(groupedTasks);
  };

  const applySorting = (taskList) => {
    if (sortOrder === 'priority') {
      taskList.sort((a, b) => b.priority - a.priority); // Sort by descending priority
    } else if (sortOrder === 'title') {
      taskList.sort((a, b) => a.title.localeCompare(b.title)); // Sort by ascending title
    }
    setFilteredTasks(taskList);
  };

  const handleSortChange = (event) => {
    const order = event.target.value;
    setSortOrder(order);
    applySorting(filteredTasks); // Sort after changing the order
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(filteredTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFilteredTasks(items);
  };

  return (
    <div>
      <select onChange={handleGroupChange}>
        <option value="user">Group by User</option>
        <option value="status">Group by Status</option>
        <option value="priority">Group by Priority</option>

      </select>

      {/* Dropdown for sorting */}
      <select onChange={handleSortChange}>
        <option value="priority">Sort by Priority</option>
        <option value="title">Sort by Title</option>
      </select>

      {/* Kanban Board with Drag-and-Drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: '8px',
                        margin: '8px 0',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                      }}
                    >
                      <strong>{task.title}</strong> <br />
                      Status: {task.status} <br />
                      Priority: {task.priority}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default App;
