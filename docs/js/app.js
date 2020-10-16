const App = function() {
  const rows = [
    { cells: [{ color: "purple", value: "teacher" }, { value: 1 }, { value: "Robert" }, { value: "Johnson" }]},
    { cells: [{ color: "purple", value: "teacher" }, { value: 2 }, { value: "Jane" }, { value: "Marsh" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 3 }, { value: "Sam" }, { value: "Jackson" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 4 }, { value: "Sarah" }, { value: "Lane" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 5 }, { value: "Ben" }, { value: "Parker" }]},
    { cells: [{ color: "purple", value: "teacher" }, { value: 6 }, { value: "Peter" }, { value: "Aston" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 7 }, { value: "Mohammed" }, { value: "Rahman" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 8 }, { value: "Jack" }, { value: "Williamson" }]},
    { cells: [{ color: "purple", value: "teacher" }, { value: 9 }, { value: "Winston" }, { value: "Mugile" }]},
    { cells: [{ color: "purple", value: "teacher" }, { value: 10 }, { value: "Clare" }, { value: "Roberts" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 11 }, { value: "Kyle" }, { value: "McKinley" }]},
    { cells: [{ color: "purple", value: "teacher" }, { value: 12 }, { value: "Luke" }, { value: "Starr" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 13 }, { value: "Dan" }, { value: "Boston" }]},
    { cells: [{ color: "purple", value: "teacher" }, { value: 14 }, { value: "Paul" }, { value: "Pinal" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 15 }, { value: "Lewis" }, { value: "Moody" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 16 }, { value: "Morgan" }, { value: "Ponazi" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 17 }, { value: "Shanice" }, { value: "Jones" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 18 }, { value: "Thomas" }, { value: "Muller" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 19 }, { value: "William" }, { value: "D'Urban" }]},
    { cells: [{ color: "green", value: "pupil" }, { value: 20 }, { value: "Arthur" }, { value: "Morris" }]},
  ];

  function start() {
    page();
    menu();

    const tbl = new chart.TableGrid({
      container: document.getElementById("table"),
      header: [
        { value: "profession", sort: true },
        { value: "id", sort: true },
        { value: "firstname", sort: true },
        { value: "surname", sort: true }
      ]
    });

    tbl.data(rows)
      .draw();

    form(tbl);

    window.addEventListener("row-selected", e => console.log(e.detail));
  }

  function clear() {
    const cl = document.getElementById("selColor");
    cl.value = "#000000";
    const pr = document.getElementById("txtProfession");
    pr.value = "";
    const id = document.getElementById("txtId");
    id.value = "";
    const fn = document.getElementById("txtFirstname");
    fn.value = "";
    const sn = document.getElementById("txtSurname");
    sn.value = "";
  }

  function form(t) {
    const cl = document.getElementById("selColor");
    cl.addEventListener("change", () => add.disabled = (cl.value === "" || pr.value === "" || id.value === "" || fn.value === "" || sn.value === ""));

    const pr = document.getElementById("txtProfession");
    pr.addEventListener("change", () => add.disabled = (cl.value === "" || pr.value === "" || id.value === "" || fn.value === "" || sn.value === ""));

    const id = document.getElementById("txtId");
    id.addEventListener("change", () => add.disabled = (cl.value === "" || pr.value === "" || id.value === "" || fn.value === "" || sn.value === ""));

    const fn = document.getElementById("txtFirstname");
    fn.addEventListener("change", () => add.disabled = (cl.value === "" || pr.value === "" || id.value === "" || fn.value === "" || sn.value === ""));

    const sn = document.getElementById("txtSurname");
    sn.addEventListener("change", () => add.disabled = (cl.value === "" || pr.value === "" || id.value === "" || fn.value === "" || sn.value === ""));

    const clr = document.getElementById("btnClear");
    clr.addEventListener("click", clear);

    const add = document.getElementById("btnAdd");
    add.addEventListener("click", () => {
      if (cl.value !== "" && pr.value !== "" && id.value !== "" && fn.value !== "" && sn.value !== "") {
        t.data({ cells: [{ color: cl.value, value: pr.value }, { value: id.value }, { value: fn.value }, { value: sn.value }]})
         .draw();
        clear();
      }
    });
  }

  function menu() {
    const menu = document.querySelector(".menu");
    const menuButton = document.querySelector(".menu-button");

    if (menu && menuButton) {
      menuButton.addEventListener("click", e => {
        e.stopImmediatePropagation();
        menu.classList.toggle("ready");
      });
      menu.addEventListener("click", e => e.stopImmediatePropagation());
    }
    window.addEventListener("hide-menu", () => menu.classList.add("ready"));
  }

  function page() {
    const tbl = document.getElementById("table");
    tbl.addEventListener("click", () => window.dispatchEvent(new CustomEvent("hide-menu")));
  }

  App.start = start;

  return App;
};
