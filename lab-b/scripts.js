class Todo {
  constructor() {
    // lista zadań
    this.tasks = [];
    // zawartosc pola wyszukiwania
    this.term = "";
  }

  draw() {
    const results = document.querySelector("#results");
    results.innerHTML = "";

    for (const task of this.getFilteredTasks()) {
      const div = document.createElement("div");
      div.classList.add("task");

      // tekst zadania
      const textSpan = document.createElement("span");
      textSpan.classList.add("task-text");
      textSpan.textContent = task.text;
      let text = task.text;
      if (this.term.length >= 2) {
        const regex = new RegExp(`(${this.term})`, "gi");
        text = text.replace(regex, "<mark>$1</mark>");
      }
      textSpan.innerHTML = text;
      div.appendChild(textSpan);

      // data zadania
      const dateSpan = document.createElement("span");
      dateSpan.classList.add("due-date");
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        dateSpan.textContent = date.toLocaleDateString("pl-PL");
      } else {
        dateSpan.textContent = "";
      }
      div.appendChild(dateSpan);

      // edycja zadania
      const startEdit = () => {
        if(div.querySelector("input")) return;

        const taskInput = document.createElement("input");
        taskInput.type ="text";
        taskInput.value = task.text;

        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.value = task.dueDate;

        const saveButton = document.createElement("button");
        saveButton.textContent = "✅";

        div.innerHTML = "";
        div.append(taskInput, dateInput, saveButton);

        // zapis zmian
        const saveChanges = () => {
          const newText = taskInput.value.trim();
          const newDate = dateInput.value;

          if (newText.length < 3 || newText.length > 255) {
            alert("Zdanie musi mieć od 3 do 255 znaków!!!");
            this.draw();
            return;
          }

          if (newDate) {
            const now = new Date();
            const selected = new Date(newDate);
            if (selected < now) {
              alert("Data musi być w przyszłości");
              this.draw();
              return;
            }
          }

          task.text = newText;
          task.dueDate = newDate;
          this.draw();
          this.save();
        };

        saveButton.addEventListener("click", saveChanges);

        // zapis przy utracie focusu
        const handleBlur = () => {
          setTimeout(() => {
            if (!div.contains(document.activeElement)) {
              saveChanges();
            }
          }, 10);
        };

        taskInput.addEventListener("blur", handleBlur);
        dateInput.addEventListener("blur", handleBlur);

        taskInput.focus();
      }

      textSpan.addEventListener("click", startEdit);
      dateSpan.addEventListener("click", startEdit);

      // przycisk usuń
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "🗑️";
      deleteButton.addEventListener("click", () => {
        this.delete(task);
        console.log("Kliknięto przycisk:", deleteButton);
      });

      div.appendChild(deleteButton);
      results.appendChild(div);
    }
  }

  // dodawanie nowego zadania
  add(text, dueDate = "") {
    text = text.trim();
    if (text.length < 3 || text.length > 255) {
      alert("Zdanie musi mieć od 3 do 255 znaków!!!");
      return;
    }

    if (dueDate) {
      const now = new Date();
      const selected = new Date(dueDate);
      if (selected < now) {
        alert("Data musi być w przyszłości");
        return;
      }
    }
    this.tasks.push({text, dueDate});
    this.draw();
    this.save();
  }

  // usuwanie zadania
  delete(task) {
    const index = this.tasks.indexOf(task);
    this.tasks.splice(index, 1);
    this.draw();
    this.save();
  }

  // zapis do localStorage
  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  // wczytanie z localStorage
  load() {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      this.tasks = JSON.parse(stored);
    }
    this.draw();
  }

  // filtrowanie po wyszukiwaniu
  getFilteredTasks() {
    if (this.term.length < 2) {
      return this.tasks;
    }
    return this.tasks.filter((task) =>
      task.text.toLowerCase().includes(this.term.toLowerCase())
    );
  }
}

// inicjalizacja
const todo = new Todo();
document.todo = todo;
todo.load();

// dodawanie zadania
document.getElementById("saveButton").addEventListener("click", () => {
  const input = document.getElementById("taskInput");
  const dateInput = document.getElementById("datePicker");
  todo.add(input.value, dateInput.value);
  input.value = "";
  dateInput.value = "";
});

// wyszukiwanie
document.getElementById("searchbar").addEventListener("input", (e) => {
  todo.term = e.target.value;
  todo.draw();
  console.log(e);
});
