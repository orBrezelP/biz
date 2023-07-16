import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { Button, Checkbox, Input, List, Row, Col, Popconfirm, Collapse, DatePicker, Tooltip, Spin } from 'antd'; 
import { CheckOutlined, SplitCellsOutlined, DeleteOutlined, MergeCellsOutlined, PlusOutlined } from '@ant-design/icons';
import axios, { AxiosResponse } from 'axios';

import styles from './scss/TodoListPage.module.scss';

// Define the structure of a Task
interface Task {
    id: string;
    description: string;
    deadline: Date | null;
    done: boolean;
    group_id: number;
}

// Define the structure of the response from fetching tasks
interface fetchTaskResponse extends AxiosResponse {
    data: Task[];
}

// Define the structure of a TodoItem
interface TodoItem {
  id: string;
  description: string;
  deadline: Date | null;
  done: boolean;
}

// Define the structure of a TodoGroup
interface TodoGroup {
  id: number;
  name: string;
  items: TodoItem[];
}

// Define the structure of a SelectedTask
interface SelectedTask {
  groupId: number;
  taskId: string;
}

const TodoListPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false); // Track loading state
  const [todoGroups, setTodoGroups] = useState<TodoGroup[]>([{ id: 0, name: 'All Tasks', items: [] }]); // Hold todo groups
  const [newTask, setNewTask] = useState<string>(''); // Hold new task input value
  const [selectedTasks, setSelectedTasks] = useState<SelectedTask[]>([]); // Hold selected tasks
  const datePickerRef = useRef<any>(); // Ref for date picker, ideally replace 'any' with a more specific type
  const token = localStorage.getItem('token'); // Get token from local storage

  // Fetch tasks from server
  const fetchTasks = async () => {
    try {
      setIsLoading(true); // Start loading
      const response: fetchTaskResponse = await axios.get('/api/tasks', {headers: { 'Authorization': token }});
      const groups: Array<TodoGroup> = response.data.reduce((result: Array<TodoGroup>, item: any) => {
        const group = result.find((g: TodoGroup) => g.id === item.group_id);
        if (group) {
          group.items.push(item);
        } else {
          result.push({ id: item.group_id, name: item.Group.name, items: [item] });
        }
        return result;
      }, []);
      setTodoGroups(groups);
    } catch(e) {
      console.log(e);
    } finally {
      setIsLoading(false); // End loading
    }
  }

  useEffect(() => {
    fetchTasks();
  },[])

  // Add a new task
  const handleAddTask = async () => {
    if (newTask.trim() !== '') {
      try {
        setIsLoading(true); // Start loading
        await axios.post('/api/tasks', {description: newTask}, {headers: { 'Authorization': token }});
        fetchTasks();
        setNewTask('');
      } catch(e) {
        console.log(e);
      } finally {
        setIsLoading(false); // End loading
      }
    }
  };

  // Update a task
  const updateTask = async (task: { taskId: string; done?: boolean; group_id?: number; deadline?: Date; }) => {
    try {
      setIsLoading(true); // Start loading
      await axios.put('/api/tasks', task , {headers: { 'Authorization': token }});
      fetchTasks();
    } catch(e) {
      console.log(e);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Handle change of task status
  const handleTaskStatusChange = (taskId: string, done: boolean) => {
    updateTask({ taskId, done });
  };

  // Handle removal from group
  const handleRemoveFromGroup = async (groupId: number, taskId: string) => {
    updateTask({ taskId, group_id: 0 });
  };

  // Handle task deletion
  const handleDeleteTask = async (groupId: number, taskId: string) => {
    try {
      setIsLoading(true); // Start loading
      await axios.delete(`/api/tasks?taskId=${taskId}`, {headers: { 'Authorization': token }});
      fetchTasks();
    } catch(e) {
      console.log(e);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Handle setting of deadline
  const handleSetDeadline = async (groupId: number, taskId: string, date: Date) => {
    updateTask({ taskId, deadline: date });
  };

  // Check if the deadline passed
  const isLateTask = (item) => {
    try {
        if (item.done || !item.deadline)
            return false;
        const now = new Date();
        const deadline = new Date(item.deadline);
        return now.getTime() > deadline.getTime();
    } catch(e) {
        console.log(item.deadline)
        return false;
    }
  };

  // Handle creation of group
  const handleCreateGroup = async () => {
    if (selectedTasks.length < 1) {
      alert("Select at least one task to create a group");
      return;
    }
    if (selectedTasks.filter(task => task.groupId !== 0).length > 0) {
      alert("Please exclude tasks associated to groups before creating a new group");
      return;
    }
    const groupName = prompt("Enter a name for the new group");
    const taskIds = selectedTasks.map(task => task.taskId)
    try {
      setIsLoading(true); // Start loading
      await axios.post('/api/tasks/group', { groupName, taskIds }, {headers: { 'Authorization': token }});
      fetchTasks();
    } catch(e) {
      console.log(e);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Handle task selection
  const handleSelectTask = (groupId: number, taskId: string) => {
    if (selectedTasks.find(task => task.groupId === groupId && task.taskId === taskId)) {
      setSelectedTasks(selectedTasks.filter(task => !(task.groupId === groupId && task.taskId === taskId)));
    } else {
      setSelectedTasks([...selectedTasks, { groupId, taskId }]);
    }
  };

  // Render component
  return (
    <div className={styles.todoListPage}>
      <h1>Todo List</h1>

      <Spin spinning={isLoading}>
        <Input
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onPressEnter={handleAddTask}
          className={styles.newTaskInput}
        />

        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTask} className={styles.addButton}>
          Add Task
        </Button>

        <Button type="primary" icon={<MergeCellsOutlined />} onClick={handleCreateGroup} className={styles.uniteTasksButton}>
          Unite Tasks
        </Button>

        <Collapse defaultActiveKey={['0']}>
          {todoGroups.map(group => group.items.length && (
            <Collapse.Panel header={group.name} key={group.id.toString()}>
              <List
                dataSource={group.items}
                renderItem={(item) => (
                  <List.Item style={ isLateTask(item) ? {backgroundColor: 'rgba(255, 0, 0, 0.25)'} : {}}>
                    <Row className={styles.listRow} align="middle">
                      <Col flex="auto">
                        <Checkbox
                          checked={selectedTasks.some(task => task.groupId === group.id && task.taskId === item.id)}
                          onChange={() => handleSelectTask(group.id, item.id)}
                        >
                          <span style={item.done ? { textDecoration: 'line-through', color: 'gray' } : {}}>
                            {item.description}
                          </span>
                        </Checkbox>
                      </Col>
                      <Col>
                          <span className={styles.datePickerTitle}>
                              <span style={item.done ? { textDecoration: 'line-through', color: 'gray' } : {}}>
                                  Deadline: 
                              </span>
                              <DatePicker
                                  className={styles.datePicker}
                                  value={item.deadline ? dayjs(item.deadline) : null}
                                  onChange={(date) => date && handleSetDeadline(group.id, item.id, date.toDate())}
                                  ref={datePickerRef}
                                  placeholder="Select deadline"
                                  disabled={item.done}
                              />
                          </span>
                        <Tooltip title={item.done ? 'Uncomplete' : 'Compelete'}>
                          <Button type="primary" className={styles.primaryButton} icon={<CheckOutlined />} onClick={() => handleTaskStatusChange(item.id, !item.done)} />
                        </Tooltip>

                        {group.id != 0 && 
                          <Tooltip title="remove from group">
                              <Button type='primary' className={styles.primaryButton} icon={<SplitCellsOutlined />} onClick={() => handleRemoveFromGroup(group.id, item.id)} />
                          </Tooltip>
                        }
                        <Popconfirm
                          title="Are you sure to delete this task?"
                          onConfirm={() => handleDeleteTask(group.id, item.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Tooltip title="Delete" >
                              <Button danger icon={<DeleteOutlined />} className={styles.deleteTask} />
                          </Tooltip>
                        </Popconfirm>
                      </Col>
                    </Row>
                  </List.Item>
                )}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
      </Spin>
    </div>
  );
};

export default TodoListPage;
