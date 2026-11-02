const assert = require('node:assert/strict');
const test = require('node:test');

const Task = require('../models/Task');
const { createTask } = require('../controllers/taskController');

const originalCreate = Task.create;

test('createTask rejects empty title and missing due date', async () => {
  let called = false;
  Task.create = async () => {
    called = true;
    return { _id: 'task-123' };
  };

  const req = {
    body: {
      title: '   ',
      description: 'Test description',
      priority: 'High',
      dueDate: '',
      assignedTo: ['507f1f77bcf86cd799439011'],
      todoChecklist: [{ text: 'Do something', completed: false }],
    },
    user: { _id: '507f1f77bcf86cd799439012' },
  };

  let statusCode = null;
  let payload = null;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      payload = data;
      return this;
    },
  };

  await createTask(req, res);

  assert.equal(called, false, 'Task.create should not be called when validation fails');
  assert.equal(statusCode, 400);
  assert.match(payload.message, /required/i);

  Task.create = originalCreate;
});
