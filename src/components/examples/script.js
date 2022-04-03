window.components.examples = {};
window.components.examples.demoForm = (element) => {
    const form = element;
    const labels = Array.from(
      form.querySelectorAll("label")
    ).map(elem => elem.getAttribute("for"));
    window.components[element.id] = {
      elem: element,
      metadata: {
        labels: labels
      }
    }
    element.addEventListener("submit", (event) => {
      event.preventDefault();
      const inputs = Array.from(form.querySelectorAll("input"));
      const values = inputs.filter(elem => elem.getAttribute("name")).reduce(
          (acc, cur) => ({
              ...acc,
              [cur.getAttribute("name")]: cur.value
          }),
          {}
      )
      values["entry"] = (new Date()).toISOString();
      TaskCreate(values);
      form.reset();
    })
}
