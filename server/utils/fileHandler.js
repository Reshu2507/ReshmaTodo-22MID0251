const fs = require('fs/promises');
const path = require('path');

const getFilePath = () => {
  const envPath = process.env.DATA_FILE_PATH || './data/todos.json';
  // Resolve path relative to the server root
  return path.resolve(__dirname, '..', envPath);
};

const readTodosFromFile = async () => {
  const filePath = getFilePath();
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File does not exist, return empty list or default list
      // We will initialize it with default seed data if it doesn't exist
      await writeTodosToFile([]);
      return [];
    }
    throw error;
  }
};

const writeTodosToFile = async (todos) => {
  const filePath = getFilePath();
  try {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(todos, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to file:', error);
    throw new Error('Failed to persist data: ' + error.message);
  }
};

module.exports = {
  readTodosFromFile,
  writeTodosToFile
};
