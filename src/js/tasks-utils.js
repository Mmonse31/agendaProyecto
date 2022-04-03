const TaskSchema = {
    status: { 
      label: "Status",
      type: "string",
      required: true,
      values: ["pending", "deleted", "completed", "waiting", "recurring"],
    },
    uuid: { 
      label: "ID",
      type: "uuid",
      required: true
    },
    entry:  { 
      label: "Entry Date",
      type: "date",
      required: true
    },
    description: { 
      label: "Description",
      type: "string",
      required: true,
      validation: (value) => values.length > 2
    },
    start: { 
      label: "Start Date",
      type: "date"
    },
    end: { 
      label: "End Date",
      type: "date"
    },
    due: { 
      label: "Due Date",
      type: "date"
    },
    until: { 
      type: "date"
    },
    wait: { 
      type: "date"
    },
    modified: { 
      label: "Modified At",
      type: "date"
    },
    scheduled: { 
      type: "date"
    },
    recur: { 
      type: "string"
    },
    mask: { 
      type: "string"
    },
    imask: { 
      type: "integer"
    },
    parent: { 
      label: "Parent Task",
      type: "uuid"
    },
    project: { 
      label: "Project",
      type: "string"
    },
    priority: { 
      label: "priority",
      type: "string"
    },
    depends: { 
      label: "Depends",
      type: "string"
    },
    tags: { 
      label: "Tags",
      type: "array"
    },
    annotation: { 
      label: "Annotations",
      type: "array"
    }
}

function DurationParser(durationString) {
    return ""
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
  if (!TaskSchema.status.includes(data.status)) { data.status = "pending" } 
  if (!data.project) { data.project = [] }
  if (!Array.isArray(data.project)) { data.project = [data.project] }
  if (!data.tags) { data.tags = [] }
  if (!Array.isArray(data.tags)) { data.tags = [data.tags] }

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
      return db.get("tasks");
  })
}
