const fs = require('fs');

// Мокируем модуль fs
jest.mock('fs');

// Импортируем функции для тестирования
const { addTodoItem, clearTodoItems, readTodos, deleteTodoItem } = require('./functions');

describe('addTodoItem', () => {
  it('should add a todo item to the storage file', () => {
    // Мокаем данные, которые будут читаться из файла
    const existingData = JSON.stringify([{ id: 1, task: 'Complete assignment' }]);
    fs.readFileSync.mockReturnValue(existingData);

    // Мокаем данные, которые будут записаны в файл
    const newData = [{ id: 1, task: 'Complete assignment' }, { id: 2, task: 'Buy groceries' }];
    fs.writeFileSync.mockImplementation((path, data, encoding) => {
      expect(path).toBe('./storage.json');
      expect(data).toBe(JSON.stringify(newData));
      expect(encoding).toBe('utf8');
    });

    // Вызываем функцию для тестирования
    addTodoItem({ id: 2, task: 'Buy groceries' });

    // Проверяем, что функции fs были вызваны корректно
    expect(fs.readFileSync).toHaveBeenCalledWith('./storage.json', 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith('./storage.json', JSON.stringify(newData), 'utf8');
  });
});

describe('clearTodoItems', () => {
  it('should clear the todo items in the storage file', () => {
    // Мокаем данные для записи в файл
    const newData = '[]';
    fs.writeFileSync.mockImplementation((path, data, encoding) => {
      expect(path).toBe('./storage.json');
      expect(data).toBe(newData);
      expect(encoding).toBe('utf8');
    });

    // Вызываем функцию для тестирования
    clearTodoItems();

    // Проверяем, что функция fs была вызвана корректно
    expect(fs.writeFileSync).toHaveBeenCalledWith('./storage.json', newData, 'utf8');
  });
});

describe('deleteTodoItem', () => {
  it('should delete a todo item by id', () => {
    // Мокаем данные, которые будут читаться из файла
    const existingData = JSON.stringify([{ id: 1, task: 'Complete assignment' }, { id: 2, task: 'Buy groceries' }]);
    fs.readFileSync.mockReturnValue(existingData);

    // Мокаем данные, которые будут записаны в файл
    const newData = JSON.stringify([{ id: 1, task: 'Complete assignment' }]);
    fs.writeFileSync.mockImplementation((path, data, encoding) => {
      expect(path).toBe('./storage.json');
      expect(data).toBe(newData);
      expect(encoding).toBe('utf8');
    });

    // Вызываем функцию для тестирования
    const result = deleteTodoItem(2);

    // Проверяем результат удаления и вызовы функций fs
    expect(result).toBe(true);
    expect(fs.readFileSync).toHaveBeenCalledWith('./storage.json', 'utf8');
    expect(fs.writeFileSync).toHaveBeenCalledWith('./storage.json', newData, 'utf8');
  });

  it('should return false if todo item id is not found', () => {
    // Мокаем данные, которые будут читаться из файла
    const existingData = JSON.stringify([{ id: 1, task: 'Complete assignment' }]);
    fs.readFileSync.mockReturnValue(existingData);

    // Вызываем функцию для тестирования
    const result = deleteTodoItem(3);

    // Проверяем, что удаление не произошло
    expect(result).toBe(false);
    expect(fs.readFileSync).toHaveBeenCalledWith('./storage.json', 'utf8');
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});
