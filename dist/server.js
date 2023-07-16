/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/server/auth.ts":
/*!****************************!*\
  !*** ./src/server/auth.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.verifyToken = exports.generateToken = void 0;\nconst jsonwebtoken_1 = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\nconst SECRET_KEY = 'your-secret-key'; // use the same key as you used in sign\nfunction generateToken(userId) {\n    // Generate JWT token\n    return (0, jsonwebtoken_1.sign)({ userId }, SECRET_KEY, {\n        expiresIn: '1h', // Token expiration time\n    });\n}\nexports.generateToken = generateToken;\nfunction verifyToken(token, callback) {\n    (0, jsonwebtoken_1.verify)(token, SECRET_KEY, callback);\n}\nexports.verifyToken = verifyToken;\n\n\n//# sourceURL=webpack://barebones-react-typescript-express/./src/server/auth.ts?");

/***/ }),

/***/ "./src/server/db.ts":
/*!**************************!*\
  !*** ./src/server/db.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst sequelize_1 = __webpack_require__(/*! sequelize */ \"sequelize\");\nclass User extends sequelize_1.Model {\n}\nclass Task extends sequelize_1.Model {\n}\nclass Group extends sequelize_1.Model {\n}\nclass Db {\n    constructor(database) {\n        // Create a new Sequelize instance for connecting to the database\n        this.sequelize = new sequelize_1.Sequelize(database !== null && database !== void 0 ? database : 'postgres', 'postgres', 'postgres', {\n            host: 'localhost',\n            port: 5432,\n            dialect: 'postgres',\n        });\n        // Initialize the User model\n        User.init(\n        // Model attributes\n        {\n            id: {\n                type: sequelize_1.DataTypes.INTEGER,\n                primaryKey: true,\n                autoIncrement: true,\n            },\n            username: {\n                type: sequelize_1.DataTypes.STRING,\n                allowNull: false,\n                unique: true,\n            },\n            password: {\n                type: sequelize_1.DataTypes.STRING,\n                allowNull: false,\n            },\n        }, \n        // Model options\n        {\n            sequelize: this.sequelize,\n            tableName: 'users',\n            timestamps: false,\n        });\n        // Initialize the Group model\n        Group.init(\n        // Model attributes\n        {\n            id: {\n                type: sequelize_1.DataTypes.INTEGER,\n                primaryKey: true,\n                autoIncrement: true,\n            },\n            name: {\n                type: sequelize_1.DataTypes.STRING,\n                allowNull: false,\n            },\n        }, \n        // Model options\n        {\n            sequelize: this.sequelize,\n            tableName: 'groups',\n            timestamps: false,\n        });\n        // Initialize the Task model\n        Task.init(\n        // Model attributes\n        {\n            id: {\n                type: sequelize_1.DataTypes.INTEGER,\n                primaryKey: true,\n                autoIncrement: true,\n            },\n            description: {\n                type: sequelize_1.DataTypes.STRING,\n                allowNull: false,\n            },\n            deadline: {\n                type: sequelize_1.DataTypes.DATE,\n            },\n            done: {\n                type: sequelize_1.DataTypes.BOOLEAN,\n                defaultValue: false,\n            },\n            group_id: {\n                type: sequelize_1.DataTypes.INTEGER,\n                references: {\n                    model: Group,\n                    key: 'id', // 'id' refers to column name in groups table\n                }\n            },\n            user_id: {\n                type: sequelize_1.DataTypes.INTEGER,\n                references: {\n                    model: User,\n                    key: 'id', // 'id' refers to column name in users table\n                }\n            },\n        }, \n        // Model options\n        {\n            sequelize: this.sequelize,\n            tableName: 'tasks',\n            timestamps: false,\n        });\n        Task.belongsTo(User, { foreignKey: 'user_id' });\n        User.hasMany(Task, { foreignKey: 'user_id' });\n        Task.belongsTo(Group, { foreignKey: 'group_id' });\n        Group.hasMany(Task, { foreignKey: 'group_id' });\n        this.users = User;\n        this.tasks = Task;\n        this.groups = Group;\n    }\n    connect() {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                // Test the database connection\n                yield this.sequelize.authenticate();\n                console.log('Connection to the database has been established successfully.');\n                // Sync models to the database\n                yield this.sequelize.sync();\n                console.log('Models have been synced to the database.');\n            }\n            catch (error) {\n                console.error('Unable to connect to the database:', error);\n                throw error;\n            }\n        });\n    }\n    close() {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                // Close the database connection\n                yield this.sequelize.close();\n                console.log('Connection to the database has been closed successfully.');\n            }\n            catch (error) {\n                console.error('Error while closing the database connection:', error);\n                throw error;\n            }\n        });\n    }\n    getUserByUsername(username) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                // Retrieve a user by their username\n                const user = yield this.users.findOne({ where: { username } });\n                return user ? user.toJSON() : null;\n            }\n            catch (error) {\n                console.error('Error while retrieving user:', error);\n                throw error;\n            }\n        });\n    }\n    getTasksByUserId(userId) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                // Retrieve tasks by user ID, including the related group data\n                const tasks = yield this.tasks.findAll({\n                    where: { user_id: userId },\n                    include: [{\n                            model: Group,\n                            attributes: ['id', 'name'],\n                        }],\n                });\n                return tasks ? tasks.map(task => task.toJSON()) : null;\n            }\n            catch (error) {\n                console.error('Error while retrieving tasks:', error);\n                throw error;\n            }\n        });\n    }\n    createTask(description, userId) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const task = yield this.tasks.create({\n                    description,\n                    user_id: userId,\n                    group_id: 0,\n                    done: false\n                });\n                return task.toJSON();\n            }\n            catch (error) {\n                console.error('Error while creating task:', error);\n                throw error;\n            }\n        });\n    }\n    deleteTask(taskId, userId) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const task = yield this.tasks.findByPk(taskId);\n                if ((task === null || task === void 0 ? void 0 : task.user_id) != userId) {\n                    throw Error(\"Operation not permited\");\n                }\n                if (task) {\n                    yield task.destroy();\n                }\n            }\n            catch (error) {\n                console.error('Error while deleting task:', error);\n                throw error;\n            }\n        });\n    }\n    updateTask(taskId, attributes, userId) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                const task = yield this.tasks.findByPk(taskId);\n                if ((task === null || task === void 0 ? void 0 : task.user_id) != userId) {\n                    throw Error(\"Operation not permited\");\n                }\n                if (task) {\n                    yield task.update(attributes);\n                }\n            }\n            catch (error) {\n                console.error('Error while deleting task:', error);\n                throw error;\n            }\n        });\n    }\n    createGroup(taskIds, groupName, userId) {\n        return __awaiter(this, void 0, void 0, function* () {\n            try {\n                // Start a transaction\n                const t = yield this.sequelize.transaction();\n                try {\n                    // Create a new group\n                    const group = yield this.groups.create({ name: groupName }, { transaction: t });\n                    // Assign all tasks with the given IDs to the new group\n                    yield this.tasks.update({ group_id: group.id }, {\n                        where: { id: taskIds, user_id: userId },\n                        transaction: t,\n                    });\n                    // Commit the transaction\n                    yield t.commit();\n                    return group.toJSON();\n                }\n                catch (error) {\n                    // If there's an error, roll back the transaction\n                    yield t.rollback();\n                    throw error;\n                }\n            }\n            catch (error) {\n                console.error('Error while creating group:', error);\n                throw error;\n            }\n        });\n    }\n}\nexports[\"default\"] = Db;\n\n\n//# sourceURL=webpack://barebones-react-typescript-express/./src/server/db.ts?");

/***/ }),

/***/ "./src/server/routes.ts":
/*!******************************!*\
  !*** ./src/server/routes.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst express = __webpack_require__(/*! express */ \"express\");\nconst db_1 = __webpack_require__(/*! ./db */ \"./src/server/db.ts\");\nconst auth_1 = __webpack_require__(/*! ./auth */ \"./src/server/auth.ts\");\nconst crypto_1 = __webpack_require__(/*! crypto */ \"crypto\");\nconst router = express.Router();\nconst db = new db_1.default();\nconst md5 = (data) => {\n    return (0, crypto_1.createHash)('md5').update(data).digest('hex');\n};\nrouter.get('/api/hello', (req, res, next) => {\n    res.json('World');\n});\nrouter.post('/api/auth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    const { username, password } = req.body;\n    //  authentication logic\n    try {\n        yield db.connect();\n        const user = yield db.getUserByUsername(username);\n        if (user == null || user.password !== md5(password)) {\n            res.status(401).json({ message: 'Invalid credentials' });\n            return;\n        }\n        const token = (0, auth_1.generateToken)(user.id);\n        res.json({ token });\n    }\n    catch (error) {\n        console.error(error);\n        res.status(500).json({ message: 'Internal server error' });\n    }\n}));\nrouter.post('/api/verify', (req, res) => {\n    const token = req.headers['authorization'];\n    if (!token) {\n        return res.status(403).json({ message: 'No token provided.' });\n    }\n    (0, auth_1.verifyToken)(token, (err, decoded) => {\n        if (err) {\n            console.log(err);\n            return res.status(500).json({ message: 'Failed to authenticate token.' });\n        }\n        // if everything is good, save to request for use in other routes\n        res.status(200).json({ message: 'Token is valid.', userId: decoded });\n    });\n});\n// Tasks API\n// Function to handle the common code for verifying the token and fetching user ID\nconst handleTokenVerification = (req, res, callback) => {\n    const token = req.headers['authorization'];\n    if (!token) {\n        return res.status(403).json({ message: 'No token provided.' });\n    }\n    (0, auth_1.verifyToken)(token, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {\n        if (err || !decoded) {\n            console.log(err);\n            return res.status(500).json({ message: 'Failed to authenticate token.' });\n        }\n        try {\n            yield callback(decoded['userId']);\n        }\n        catch (err) {\n            res.status(500).json({ message: 'Internal server error' });\n        }\n    }));\n};\n// GET endpoint to fetch all tasks for a specific user\nrouter.get('/api/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    handleTokenVerification(req, res, (userId) => __awaiter(void 0, void 0, void 0, function* () {\n        // Query the database to fetch all tasks for the specific user\n        const tasks = yield db.getTasksByUserId(userId);\n        // Return tasks as a JSON response\n        res.json(tasks);\n    }));\n}));\n// POST endpoint to create a new task for a specific user\nrouter.post('/api/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    handleTokenVerification(req, res, (userId) => __awaiter(void 0, void 0, void 0, function* () {\n        const { description } = req.body;\n        // Query the database to create a new task\n        yield db.createTask(description, userId);\n        // Return the created task as a JSON response\n        res.status(201).json({ message: 'OK' });\n    }));\n}));\n// DELETE endpoint to delete a task\nrouter.delete('/api/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    handleTokenVerification(req, res, (userId) => __awaiter(void 0, void 0, void 0, function* () {\n        const taskId = req.query.taskId || '';\n        // Query the database to create a new task\n        yield db.deleteTask(taskId.toString(), userId);\n        // Return the created task as a JSON response\n        res.status(201).json({ message: 'OK' });\n    }));\n}));\n// PUT endpoint to update a task\nrouter.put('/api/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    handleTokenVerification(req, res, (userId) => __awaiter(void 0, void 0, void 0, function* () {\n        const { taskId } = req.body;\n        console.log(req.body);\n        // Update task\n        const group = yield db.updateTask(taskId, req.body, userId);\n        // Return the created group as a JSON response\n        res.status(201).json({ group });\n    }));\n}));\n// POST endpoint to create a group and assign tasks to it\nrouter.post('/api/tasks/group', (req, res) => __awaiter(void 0, void 0, void 0, function* () {\n    handleTokenVerification(req, res, (userId) => __awaiter(void 0, void 0, void 0, function* () {\n        const taskIds = req.body.taskIds || [];\n        const groupName = req.body.groupName || '';\n        // Query the database to create a new group and assign tasks to it\n        const group = yield db.createGroup(taskIds, groupName, userId);\n        // Return the created group as a JSON response\n        res.status(201).json({ group });\n    }));\n}));\nrouter.get('*', (req, res) => {\n    res.redirect('/');\n});\nexports[\"default\"] = router;\n\n\n//# sourceURL=webpack://barebones-react-typescript-express/./src/server/routes.ts?");

/***/ }),

/***/ "./src/server/server.ts":
/*!******************************!*\
  !*** ./src/server/server.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst express = __webpack_require__(/*! express */ \"express\");\nconst routes_1 = __webpack_require__(/*! ./routes */ \"./src/server/routes.ts\");\nconst app = express();\napp.use(express.json());\napp.use(express.static('public'));\napp.use(routes_1.default);\nconst port = process.env.PORT || 3000;\napp.listen(port, () => console.log(`Server listening on port: ${port}`));\n\n\n//# sourceURL=webpack://barebones-react-typescript-express/./src/server/server.ts?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("sequelize");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server/server.ts");
/******/ 	
/******/ })()
;