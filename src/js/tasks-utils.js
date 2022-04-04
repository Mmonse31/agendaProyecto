const TaskSchema = {
    hora: {
      label: "Hora",
      type: "time",
      required: true,
    },
    date: {
      label: "Date",
      type: "date",
      required: true,
    },
    description: { 
      label: "Description",
      type: "string",
      required: true,
      validation: (value) => values.length > 2
    },
   
}

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

function GetTasksDatabase() {
    const databaseName = "tasks";
    const version  = 1;
    return idb.openDB(databaseName, version, {
        upgrade(db) {
            console.log("Upgrading Database");
            const objectStore = db.createObjectStore("tasks", {
                keyPath: "uuid",
            });
            objectStore.createIndex("project", "project", {
                unique: false,
                multiEntry: true,
            });
            objectStore.createIndex("tags", "tags", {
                unique: false,
                multiEntry: true,
            });
            objectStore.createIndex("status", "status", {
                unique: false,
                multiEntry: true,
            });
        },
    })
}

function TaskValidator(data) {
    
}

function TaskCreate(data) {
  if (!data.uuid) { data.uuid = uuidv4(); }

  console.table(data);
  return GetTasksDatabase().then(db => {
      return db.put("tasks", data);
    }
  )
}

function TasksGetByStatus(status) {
    return GetTasksDatabase().then(db => {
        return db.getAllFromIndex("tasks", "status", status);
    })
}

function ListTasks(project=[], tags=[]) {
  GetTasksDatabase().then(db => {
    db.getAll("tasks").then(tasks => {
        let outerHTML = '';
    
        for (const key in tasks) {
            outerHTML += '\n\
                          <tr>\n\
                              <td>' + tasks[key].description + '</td>\n\
                              <td>' + tasks[key].date + '</td>\n\
                              <td>' + tasks[key].hora + '</td>\n\
                              <td>' + tasks[key].entry + '</td>\n\
                          </tr>';
        }
        tasks = [];
        document.querySelector("#tasksList").innerHTML = outerHTML;
    });
  });
}
