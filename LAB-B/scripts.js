class Todo {
  constructor() {
    this.tasks = [];
    this.term = "";
    this.editingId = null;

    const saved = localStorage.getItem("lab-b-tasks");
    if (saved) {
      try {
        this.tasks = JSON.parse(saved);
      } catch (e) {
        this.tasks = [];
      }
    }

    this.list = document.getElementById("taskList");
    this.search = document.getElementById("searchInput");
    this.form = document.getElementById("addForm");
    this.text = document.getElementById("taskInput");
    this.date = document.getElementById("dateInput");
    this.message = document.getElementById("message");

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.add();
    });

    this.search.addEventListener("input", () => {
      this.term = this.search.value.trim();
      this.draw();
    });

    this.list.addEventListener("click", (e) => {
      const saveButton = e.target.closest(".save-button");

      if (saveButton) {
        e.stopPropagation();
        this.saveEdit();
        return;
      }

      const cancelButton = e.target.closest(".cancel-button");

      if (cancelButton) {
        e.stopPropagation();
        this.cancelEdit();
        return;
      }

      const removeButton = e.target.closest(".delete-button");

      if (removeButton) {
        e.stopPropagation();
        this.remove(Number(removeButton.dataset.id));
        return;
      }

      const item = e.target.closest(".task-item");
      if (!item || item.classList.contains("editing") || this.editingId !== null) {
        return;
      }

      e.stopPropagation();

      this.editingId = Number(item.dataset.id);
      this.draw();

      const input = this.list.querySelector(".edit-text");
      if (input) {
        input.focus();
      }
    });

    this.draw();
  }

  save() {
    localStorage.setItem("lab-b-tasks", JSON.stringify(this.tasks));
  }

  showMessage(text) {
    this.message.textContent = text;
  }

  validate(text, date) {
    if (text.length < 3) {
      return "Treść zadania musi mieć co najmniej 3 znaki.";
    }

    if (text.length > 255) {
      return "Treść zadania może mieć maksymalnie 255 znaków.";
    }

    if (date && new Date(date) <= new Date()) {
      return "Data musi być pusta albo ustawiona w przyszłości.";
    }

    return "";
  }

  add() {
    const text = this.text.value.trim();
    const date = this.date.value;
    const error = this.validate(text, date);

    if (error) {
      this.showMessage(error);
      return;
    }

    this.tasks.push({
      id: Date.now(),
      text: text,
      date: date
    });

    this.save();
    this.showMessage("");
    this.text.value = "";
    this.date.value = "";
    this.draw();
  }

  remove(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    if (this.editingId === id) {
      this.editingId = null;
    }
    this.save();
    this.draw();
  }

  saveEdit() {
    if (this.editingId === null) {
      return;
    }

    const textInput = this.list.querySelector(".edit-text");
    const dateInput = this.list.querySelector(".edit-date");
    const text = textInput.value.trim();
    const date = dateInput.value;
    const error = this.validate(text, date);

    if (error) {
      this.showMessage(error);
      return;
    }

    const task = this.tasks.find((task) => task.id === this.editingId);
    if (task) {
      task.text = text;
      task.date = date;
    }

    this.editingId = null;
    this.save();
    this.showMessage("");
    this.draw();
  }

  cancelEdit() {
    this.editingId = null;
    this.showMessage("");
    this.draw();
  }

  getTasks() {
    if (this.term.length < 2) {
      return this.tasks;
    }

    const result = [];

    for (let i = 0; i < this.tasks.length; i += 1) {
      if (this.tasks[i].text.toLowerCase().includes(this.term.toLowerCase())) {
        result.push(this.tasks[i]);
      }
    }

    return result;
  }

  putText(text, element) {
    if (this.term.length < 2) {
      element.textContent = text;
      return;
    }

    const lowerText = text.toLowerCase();
    const lowerTerm = this.term.toLowerCase();
    let start = 0;
    let index = lowerText.indexOf(lowerTerm);

    if (index === -1) {
      element.textContent = text;
      return;
    }

    while (index !== -1) {
      if (index > start) {
        element.append(text.slice(start, index));
      }

      const mark = document.createElement("mark");
      mark.textContent = text.slice(index, index + this.term.length);
      element.append(mark);

      start = index + this.term.length;
      index = lowerText.indexOf(lowerTerm, start);
    }

    if (start < text.length) {
      element.append(text.slice(start));
    }
  }

  draw() {
    const tasks = this.getTasks();

    this.list.innerHTML = "";

    if (tasks.length === 0) {
      const empty = document.createElement("div");
      empty.className = "no-tasks";

      if (this.term.length >= 2) {
        empty.textContent = "Brak wyników wyszukiwania.";
      } else {
        empty.textContent = "Brak zadań na liście.";
      }

      this.list.append(empty);
      return;
    }

    for (let i = 0; i < tasks.length; i += 1) {
      const task = tasks[i];
      const item = document.createElement("div");
      item.className = "task-item";
      item.dataset.id = task.id;

      if (task.id === this.editingId) {
        item.classList.add("editing");

        const box = document.createElement("div");
        box.className = "task-edit";

        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.className = "edit-text";
        textInput.maxLength = 255;
        textInput.value = task.text;

        const dateInput = document.createElement("input");
        dateInput.type = "datetime-local";
        dateInput.className = "edit-date";
        dateInput.value = task.date;

        const help = document.createElement("p");
        help.className = "edit-help";
        help.textContent = "Po zmianie kliknij przycisk Zapisz.";

        const saveButton = document.createElement("button");
        saveButton.type = "button";
        saveButton.className = "save-button";
        saveButton.textContent = "Zapisz";

        const buttons = document.createElement("div");
        buttons.className = "edit-buttons";

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.className = "cancel-button";
        cancelButton.textContent = "Anuluj";

        buttons.append(saveButton, cancelButton);
        box.append(textInput, dateInput, help, buttons);
        item.append(box);
        this.list.append(item);
        continue;
      }

      const content = document.createElement("div");
      content.className = "task-content";

      const text = document.createElement("div");
      text.className = "task-text";
      this.putText(task.text, text);

      const date = document.createElement("div");
      date.className = "task-date";
      if (task.date) {
        date.textContent = "Termin: " + task.date.replace("T", " ");
      } else {
        date.textContent = "Termin: Brak terminu";
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "delete-button";
      button.dataset.id = task.id;
      button.textContent = "Usuń";

      content.append(text, date);
      item.append(content, button);
      this.list.append(item);
    }
  }
}

document.todo = new Todo();
