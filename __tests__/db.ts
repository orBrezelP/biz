import Db from '../src/server/db'
import { Sequelize } from 'sequelize';

describe('Db', () => {
  let db: Db;

  beforeAll(async () => {
    db = new Db('test');
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  afterEach(async () => {
    // Clear the database after each test
    await db.tasks.destroy({ where: {} });
    await db.groups.destroy({ where: {} });
    await db.users.destroy({ where: {} });
  });

  describe('getUserByUsername', () => {
    it('should retrieve a user by their username', async () => {
      // Create a user for testing
      const username = 'testuser';
      const password = 'testpassword';
      await db.users.create({ username, password });

      // Retrieve the user
      const user = await db.getUserByUsername(username);

      expect(user).toBeDefined();
      expect(user?.username).toBe(username);
      expect(user?.password).toBe(password);
    });

    it('should return null if the user does not exist', async () => {
      // Retrieve a non-existent user
      const user = await db.getUserByUsername('nonexistentuser');

      expect(user).toBeNull();
    });
  });

  describe('getTasksByUserId', () => {
    it('should retrieve tasks by user ID, including the related group data', async () => {
      // Create a user and a group for testing
      const user = await db.users.create({ username: 'testuser', password: 'testpassword' });
      const group = await db.groups.create({ name: 'testgroup' });

      // Create tasks associated with the user and the group
      await db.tasks.create({ description: 'task1', user_id: user.id, group_id: group.id });
      await db.tasks.create({ description: 'task2', user_id: user.id, group_id: group.id });

      // Retrieve tasks for the user
      const tasks = await db.getTasksByUserId(user.id.toString());

      expect(tasks).toBeDefined();
      expect(tasks).toHaveLength(2);

      tasks?.forEach((task) => {
        expect(task.description).toMatch(/task\d/);
        expect(task.Group).toBeDefined();
        expect(task.Group.name).toBe(group.name);
      });
    });

    it('should return null if there are no tasks for the user', async () => {
      // Create a user without any tasks
      const user = await db.users.create({ username: 'testuser', password: 'testpassword' });

      // Retrieve tasks for the user
      const tasks = await db.getTasksByUserId(user.id.toString());

      expect(tasks).toStrictEqual([]);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      // Create a user for testing
      const user = await db.users.create({ username: 'testuser', password: 'testpassword' });
      const group = await db.groups.create({ id: 0, name: 'testgroup' });

      // Create a new task
      const description = 'New task';
      const task = await db.createTask(description, user.id);

      expect(task).toBeDefined();
      expect(task.description).toBe(description);
      expect(task.user_id).toBe(user.id);
    });

    it('should throw an error if the user does not exist', async () => {
      // Try to create a task with a non-existent user
      const description = 'New task';
      const userId = 999; // Non-existent user ID

      await expect(db.createTask(description, userId)).rejects.toThrowError();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      // Create a user and a task for testing
      const user = await db.users.create({ username: 'testuser', password: 'testpassword' });
      const task = await db.tasks.create({ description: 'test task', user_id: user.id });

      // Delete the task
      await db.deleteTask(task.id.toString(), user.id);

      // Try to retrieve the task
      const deletedTask = await db.tasks.findByPk(task.id);

      expect(deletedTask).toBeNull();
    });

    it('should throw an error if the task does not exist', async () => {
      // Create a user for testing
      const user = await db.users.create({ username: 'testuser', password: 'testpassword' });

      // Try to delete a non-existent task
      const taskId = '999'; // Non-existent task ID

      await expect(db.deleteTask(taskId, user.id)).rejects.toThrowError();
    });

    it('should throw an error if the user is not authorized', async () => {
      // Create two users for testing
      const user1 = await db.users.create({ username: 'user1', password: 'testpassword' });
      const user2 = await db.users.create({ username: 'user2', password: 'testpassword' });

      // Create a task associated with user1
      const task = await db.tasks.create({ description: 'test task', user_id: user1.id });

      // Try to delete the task using user2's ID
      await expect(db.deleteTask(task.id.toString(), user2.id)).rejects.toThrowError();
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      // Create a user and a task for testing
      const user = await db.users.create({ username: 'testuser', password: 'testpassword' });
      const task = await db.tasks.create({ description: 'test task', user_id: user.id });

      // Update the task
      const newDescription = 'Updated task';
      await db.updateTask(task.id.toString(), { description: newDescription }, user.id);

      // Retrieve the updated task
      const updatedTask = await db.tasks.findByPk(task.id);

      expect(updatedTask).toBeDefined();
      expect(updatedTask?.description).toBe(newDescription);
    });

    it('should throw an error if the task does not exist', async () => {
      // Create a user for testing
      const user = await db.users.create({ username: 'testuser', password: 'testpassword' });

      // Try to update a non-existent task
      const taskId = '999'; // Non-existent task ID

      await expect(db.updateTask(taskId, { description: 'Updated task' }, user.id)).rejects.toThrowError();
    });

    it('should throw an error if the user is not authorized', async () => {
      // Create two users for testing
      const user1 = await db.users.create({ username: 'user1', password: 'testpassword' });
      const user2 = await db.users.create({ username: 'user2', password: 'testpassword' });

      // Create a task associated with user1
      const task = await db.tasks.create({ description: 'test task', user_id: user1.id });

      // Try to update the task using user2's ID
      await expect(db.updateTask(task.id.toString(), { description: 'Updated task' }, user2.id)).rejects.toThrowError();
    });
  });

  describe('createGroup', () => {
    it('should create a new group and assign tasks to it', async () => {
      // Create a user for testing
      const user = await db.users.create({ username: 'testuser', password: 'testpassword' });

      // Create two tasks associated with the user
      const task1 = await db.tasks.create({ description: 'task1', user_id: user.id });
      const task2 = await db.tasks.create({ description: 'task2', user_id: user.id });

      // Create a new group and assign the tasks to it
      const groupName = 'New group';
      const group = await db.createGroup([task1.id, task2.id], groupName, user.id);

      // Retrieve the assigned tasks
      const assignedTasks = await db.tasks.findAll({ where: { group_id: group.id } });

      expect(group).toBeDefined();
      expect(group.name).toBe(groupName);
      expect(assignedTasks).toHaveLength(2);
      assignedTasks?.forEach((task) => {
        expect(task.group_id).toBe(group.id);
      });
    });

  });
});
