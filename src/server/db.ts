import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize';

interface UserAttributes {
  id: number;
  username: string;
  password: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
}

interface TaskAttributes {
  id?: number;
  description: string;
  deadline?: Date;
  done: boolean;
  group_id: number;
  user_id: number;
}

class Task extends Model<TaskAttributes> implements TaskAttributes {
  public id!: number;
  public description!: string;
  public deadline!: Date;
  public done!: boolean;
  public group_id!: number;
  public user_id!: number;
}

interface GroupAttributes {
  id?: number;
  name: string;
}

class Group extends Model<GroupAttributes> implements GroupAttributes {
  public id!: number;
  public name!: string;
}

class Db {
  private sequelize: Sequelize;
  public users: ModelCtor<User>;
  public tasks: ModelCtor<Task>;
  public groups: ModelCtor<Group>;

  constructor(database?: string) {
    // Create a new Sequelize instance for connecting to the database
    this.sequelize = new Sequelize(database ?? 'postgres', 'postgres', 'postgres', {
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
    });

    // Initialize the User model
    User.init(
      // Model attributes
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      // Model options
      {
        sequelize: this.sequelize,
        tableName: 'users',
        timestamps: false,
      }
    );

    // Initialize the Group model
    Group.init(
      // Model attributes
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      // Model options
      {
        sequelize: this.sequelize,
        tableName: 'groups',
        timestamps: false,
      }
    );

    // Initialize the Task model
    Task.init(
      // Model attributes
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        deadline: {
          type: DataTypes.DATE,
        },
        done: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        group_id: {
          type: DataTypes.INTEGER,
          references: {
            model: Group, // 'groups' refers to table name
            key: 'id', // 'id' refers to column name in groups table
          }
        },
        user_id: {
          type: DataTypes.INTEGER,
          references: {
            model: User, // 'users' refers to table name
            key: 'id', // 'id' refers to column name in users table
          }
        },
      },
      // Model options
      {
        sequelize: this.sequelize,
        tableName: 'tasks',
        timestamps: false,
      }
    );

    Task.belongsTo(User, { foreignKey: 'user_id' });
    User.hasMany(Task, { foreignKey: 'user_id' });

    Task.belongsTo(Group, { foreignKey: 'group_id' });
    Group.hasMany(Task, { foreignKey: 'group_id' });

    this.users = User;
    this.tasks = Task;
    this.groups = Group;
  }

  public async connect(): Promise<void> {
    try {
      // Test the database connection
      await this.sequelize.authenticate();
      console.log('Connection to the database has been established successfully.');

      // Sync models to the database
      await this.sequelize.sync();
      console.log('Models have been synced to the database.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    try {
      // Close the database connection
      await this.sequelize.close();
      console.log('Connection to the database has been closed successfully.');
    } catch (error) {
      console.error('Error while closing the database connection:', error);
      throw error;
    }
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    try {
      // Retrieve a user by their username
      const user = await this.users.findOne({ where: { username } });
      return user ? user.toJSON() as User : null;
    } catch (error) {
      console.error('Error while retrieving user:', error);
      throw error;
    }
  }

  public async getTasksByUserId(userId: string): Promise<(Task & { Group: Group })[] | null> {
    try {
      // Retrieve tasks by user ID, including the related group data
      const tasks = await this.tasks.findAll({
        where: { user_id: userId },
        include: [{
          model: Group,
          attributes: ['id', 'name'], 
        }],
      });
      
      return tasks ? tasks.map(task => task.toJSON() as Task & { Group: Group }) : null;
    } catch (error) {
      console.error('Error while retrieving tasks:', error);
      throw error;
    }
  }
  

  public async createTask(description: string, userId: number): Promise<Task> {
    try {
      const task = await this.tasks.create({
        description,
        user_id: userId,
        group_id: 0,
        done: false
      });
      return task.toJSON() as Task;
    } catch (error) {
      console.error('Error while creating task:', error);
      throw error;
    }
  }

  public async deleteTask(taskId: string, userId: number): Promise<void> {
    try {
      const task = await this.tasks.findByPk(taskId);
      if (task?.user_id != userId) {
        throw Error("Operation not permited");
      }
      if (task) {
        await task.destroy();
      }
    } catch (error) {
      console.error('Error while deleting task:', error);
      throw error;
    }
  }

  public async updateTask(taskId: string, attributes: Partial<TaskAttributes>, userId: number): Promise<void> {
    try {
      const task = await this.tasks.findByPk(taskId);
      if (task?.user_id != userId) {
        throw Error("Operation not permited");
      }
      if (task) {
        await task.update(attributes);
      }
    } catch (error) {
      console.error('Error while deleting task:', error);
      throw error;
    }
  }

  public async createGroup(taskIds: number[], groupName: string, userId: number): Promise<Group> {
    try {
      // Start a transaction
      const t = await this.sequelize.transaction();
      
      try {
        // Create a new group
        const group = await this.groups.create({ name: groupName }, { transaction: t });

        // Assign all tasks with the given IDs to the new group
        await this.tasks.update({ group_id: group.id }, {
          where: { id: taskIds, user_id: userId },
          transaction: t,
        });

        // Commit the transaction
        await t.commit();

        return group.toJSON() as Group;
      } catch (error) {
        // If there's an error, roll back the transaction
        await t.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Error while creating group:', error);
      throw error;
    }
  }

  
}

export default Db;
