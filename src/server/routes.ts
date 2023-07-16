import * as express from 'express';
import Db from './db'; 
import { verifyToken, generateToken} from './auth';
import { createHash } from 'crypto';

const router = express.Router();
const db = new Db();

const md5 = (data) => {
    return createHash('md5').update(data).digest('hex');
}




router.get('/api/hello', (req, res, next) => {
    res.json('World');
});

router.post('/api/auth', async (req, res) => {
    const { username, password } = req.body;
  
    //  authentication logic
    try {
        await db.connect();
        const user = await db.getUserByUsername(username);
        if (user == null || user.password !== md5(password)) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
    
        const token = generateToken(user.id);    
    
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/api/verify', (req, res) => {
    const token = req.headers['authorization'];
    
    if (!token) {
      return res.status(403).json({ message: 'No token provided.' });
    }
  
    verifyToken(token, (err, decoded) => {
      if (err) {
        console.log(err)
        return res.status(500).json({ message: 'Failed to authenticate token.' });
      }
  
      // if everything is good, save to request for use in other routes
      res.status(200).json({ message: 'Token is valid.', userId: decoded });
    });
  });

  // Tasks API

// Function to handle the common code for verifying the token and fetching user ID
const handleTokenVerification = (req, res, callback) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    verifyToken(token, async (err, decoded) => {
        if (err || !decoded) {
        console.log(err);
        return res.status(500).json({ message: 'Failed to authenticate token.' });
        }

        try {
        await callback(decoded['userId']);
        } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
        }
    });
};
  
// GET endpoint to fetch all tasks for a specific user
router.get('/api/tasks', async (req, res) => {
    handleTokenVerification(req, res, async (userId) => {
        // Query the database to fetch all tasks for the specific user
        const tasks = await db.getTasksByUserId(userId);
        // Return tasks as a JSON response
        res.json(tasks);
    });
});

// POST endpoint to create a new task for a specific user
router.post('/api/tasks', async (req, res) => {
    handleTokenVerification(req, res, async (userId) => {
        const { description } = req.body;
        // Query the database to create a new task
        await db.createTask(description, userId);
        // Return the created task as a JSON response
        res.status(201).json({ message: 'OK' });
    });
});

// DELETE endpoint to delete a task
router.delete('/api/tasks', async (req, res) => {
    handleTokenVerification(req, res, async (userId) => {
        const taskId = req.query.taskId || '';
        // Query the database to create a new task
        await db.deleteTask(taskId.toString(), userId);
        // Return the created task as a JSON response
        res.status(201).json({ message: 'OK' });
    });
});

// PUT endpoint to update a task
router.put('/api/tasks', async (req, res) => {
    handleTokenVerification(req, res, async (userId) => {
        const { taskId } = req.body;
        console.log(req.body);
        // Update task
        const group = await db.updateTask(taskId, req.body, userId);
        // Return the created group as a JSON response
        res.status(201).json({ group });
    });
});


// POST endpoint to create a group and assign tasks to it
router.post('/api/tasks/group', async (req, res) => {
    handleTokenVerification(req, res, async (userId) => {
        const taskIds = req.body.taskIds || [];
        const groupName = req.body.groupName || '';

        // Query the database to create a new group and assign tasks to it
        const group = await db.createGroup(taskIds, groupName, userId);

        // Return the created group as a JSON response
        res.status(201).json({ group });
    });
});


router.get('*', (req, res) => {
    res.redirect('/');
});

export default router;