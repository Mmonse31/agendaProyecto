console.log("/components/tasks/script.js")
function InitTaskForm(element) {
    const form = element;
    // Get Labels
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
      console.table(values);
      form.reset();
    })
}
