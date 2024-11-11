const fs = require('fs');
const { clearTodoItems } = require('./functions');

describe('clearTodoItems', () => {
  it('should clear the data in storage.json', () => {
    // Mock the fs.writeFile function
    fs.writeFile = jest.fn();

    // Call the function
    clearTodoItems();

    // Check if fs.writeFile was called with the correct arguments
    expect(fs.writeFile).toHaveBeenCalledWith(
      './storage.json',
      '[]',
      'utf8',
      expect.any(Function)
    );
  });

  it('should log a message when data is cleared', () => {
    // Mock the fs.writeFile function
    fs.writeFile = jest.fn();

    // Mock the console.log function
    // console.log = jest.fn();

    // Call the function
    clearTodoItems();

    // Check if console.log was called with the correct message
    expect(console.log).toHaveBeenCalledWith('Data cleared from storage.json');
  });

  it('should handle errors when writing to storage.json', () => {
    // Mock the fs.writeFile function
    fs.writeFile = jest.fn((path, data, encoding, callback) => {
      callback(new Error('Write error')); // Simulate write error
    });

    // Call the function
    clearTodoItems();

    // Check if the error is handled correctly
    // You can customize this assertion based on your error handling logic
    expect(fs.writeFile).toThrow('Write error');
  });
});

// Add more tests for other functions if needed