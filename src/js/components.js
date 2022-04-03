/**
 * En nuestro sistema de componentes los nombraremos por su ruta relativa a 
 * el directorio de componentes.
 * por ejemplo el component de la forma para tareas sencillas es:
 *      /tasks/form
 * Los componentes deben de tener solo un elemento HTML en su raiz.
 * Para cargar un component, se buscara exclusivamente a el "componente" nombrado,
 *      script
 * hermano al component que buscamos, para "/tasks/form", si deseamos implementar
 * codigo javascript en algun component de la familia "/tasks/",
 * esto debe de estar dentro del archivo "/tasks/scripts.js", este
 * sera descargado, evaluado al contexto, y estara disponible.
**/
window._remote_scripts = {};
window.components = {};

// LoadHTTTResource(url).MountComponent().LoadInit().catch()

function CopyDataset(source, target) {
    Object.keys(source.dataset).map(key => {
        target.dataset[key] = source.dataset[key];
    });
    return target;
}

function GetComponentInitFunctionPath(component) {
  const window_path = ["components", ...component.split("/").slice(1)];
  return window_path;
};

function GetComponentInitFunction(component) {
  return GetComponentInitFunctionPath(component).reduce((acc, cur) => acc[cur], window)
}

function GetScriptForComponent(component) {
  return [...component.split("/").slice(0, -1), "script"].join("/")
}

function InyectRemoteScript(uri, onload=null) {
  const body = document.querySelector("body")
  const script = document.createElement("script")
  script.src = uri;
  if (onload)
      window._remote_scripts[uri] = [onload];
  script.onload = (e) => {
      const promiseArray = window._remote_scripts[uri];
      if (Array.isArray(promiseArray)) {
        promiseArray.map(resolver => resolver(script))
      }
      window._remote_scripts[uri] = true;
  };
  body.appendChild(script)
  return script;
}

function InyectComponentScript(component, onload=null) {
  const componentScript = GetScriptForComponent(component)
  const scriptName = `/components${componentScript}.js`
  const script = window._remote_scripts[scriptName];
  console.info({
      message: "when loading script we found:" ,
      script: script,
      onload: onload,
  })
  if (script === true) {
    console.info(`Script loaded previously: ${scriptName}`)
    onload && onload(script)
  } else if (Array.isArray(window._remote_scripts[scriptName])) {
    console.info(`Script already loading: ${scriptName}`)
    script.push(onload)
  } else {
    console.info(`Script queued to be loaded: ${scriptName}`)
    InyectRemoteScript(scriptName, onload);
  }
}

function InyectComponent(element, component) {
  fetch(`/components${component}.html`)
    .then(response => { // Fetch component body.
        if (response.headers.get("content-type") !== 'text/html') {
          console.warn(response.headers);
          // throw Error(`Response of type ${response.headers["Content-Type"]}`);
          // To avoid conflics with liveServer in vscode.
        }
        return response.text();
    })
    .then(body => { // Mount the component to the DOM.
      element.innerHTML = body;
      if (element.dataset["fragment"] === "") {
        console.debug(`${component} is a fragment`);
      }
      else {
        console.debug(`${component} is not a fragment`)
        new_element = element.firstChild;
        new_element = CopyDataset(element, new_element);
        element.parentNode.replaceChild(element.firstChild, element);
        element = new_element;
      }
      return element;
    })
    .then(elem => { // Load the script file for the component.
      const initFunction = elem.dataset["componentInit"];
      if (initFunction !== undefined) {
        return new Promise(resolve => {
            const script = InyectComponentScript(component, (e) => resolve(elem));
        })
        .then(script => {
          try {
              const func = GetComponentInitFunction(component)
              console.debug({
                  message:"Callinig component init method.",
                  method: func, 
                  element: elem
              })
              func(elem);
          }
          catch (e) {
              console.error(`There was a problem loading init for ${component}`);
              console.error(e);
          }
          return elem;
        })
      }
      return elem;
    })
    .catch(error => {
        console.error(error)
    })
}

function InitComponents() {
  return Promise.all(
      Array.from(document.querySelectorAll("[data-component]")).map(
        elem => InyectComponent(elem, elem.dataset["component"])
      )
  ).then(elements => {
    console.debug(`Loaded ${elements.length} components`);
    return elements
  })
}
