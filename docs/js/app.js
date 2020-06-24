const App = function() {
  const json = {
    headers: [
      { value: "profession", sort: true },
      { value: "id", sort: true },
      { value: "firstname", sort: true },
      { value: "surname", sort: true }
    ],
    rows: [
      [{ color: "purple", value: "teacher" }, { value: 1 }, { value: "Robert" }, { value: "Johnson" }],
      [{ color: "purple", value: "teacher" }, { value: 2 }, { value: "Jane" }, { value: "Marsh" }],
      [{ color: "green", value: "pupil" }, { value: 3 }, { value: "Sam" }, { value: "Jackson" }],
      [{ color: "green", value: "pupil" }, { value: 4 }, { value: "Sarah" }, { value: "Lane" }],
      [{ color: "green", value: "pupil" }, { value: 5 }, { value: "Ben" }, { value: "Parker" }],
      [{ color: "purple", value: "teacher" }, { value: 6 }, { value: "Peter" }, { value: "Aston" }],
      [{ color: "green", value: "pupil" }, { value: 7 }, { value: "Mohammed" }, { value: "Rahman" }],
      [{ color: "green", value: "pupil" }, { value: 8 }, { value: "Jack" }, { value: "Williamson" }],
      [{ color: "purple", value: "teacher" }, { value: 9 }, { value: "Winston" }, { value: "Mugile" }],
      [{ color: "purple", value: "teacher" }, { value: 10 }, { value: "Clare" }, { value: "Roberts" }],
      [{ color: "green", value: "pupil" }, { value: 11 }, { value: "Kyle" }, { value: "McKinley" }],
      [{ color: "purple", value: "teacher" }, { value: 12 }, { value: "Luke" }, { value: "Starr" }],
      [{ color: "green", value: "pupil" }, { value: 13 }, { value: "Dan" }, { value: "Boston" }],
      [{ color: "purple", value: "teacher" }, { value: 14 }, { value: "Paul" }, { value: "Pinal" }],
      [{ color: "green", value: "pupil" }, { value: 15 }, { value: "Lewis" }, { value: "Moody" }],
      [{ color: "green", value: "pupil" }, { value: 16 }, { value: "Morgan" }, { value: "Ponazi" }],
      [{ color: "green", value: "pupil" }, { value: 17 }, { value: "Shanice" }, { value: "Jones" }],
      [{ color: "green", value: "pupil" }, { value: 18 }, { value: "Thomas" }, { value: "Muller" }],
      [{ color: "green", value: "pupil" }, { value: 19 }, { value: "William" }, { value: "D'Urban" }],
      [{ color: "green", value: "pupil" }, { value: 20 }, { value: "Arthur" }, { value: "Morris" }],
    ]
  };

  function start () {
    page();
    menu();

    const tbl = new chart.TableGrid({
      container: document.getElementById("table"),
      data: json,
    });

    tbl.draw();

    window.addEventListener("row-selected", function(event) {
      console.log(event.detail);
    });
  }

  function menu() {
    const menu = document.querySelector(".menu");
    const menuButton = document.querySelector(".menu-button");

    if (menu && menuButton) {
      menuButton.addEventListener("click", function(e) {
        e.stopImmediatePropagation();
        menu.classList.toggle("ready");
      });
      menu.addEventListener("click", function(e) { e.stopImmediatePropagation(); });
    }
    window.addEventListener("hide-menu", function() { menu.classList.add("ready"); });
  }

  function page() {
    const tbl = document.getElementById("table");
    
    tbl.addEventListener("click", function() {
      window.dispatchEvent(new CustomEvent("hide-menu"));
    });
  }

  App.start = start;

  return App;
};
