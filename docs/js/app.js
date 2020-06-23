const App = function() {
  const json = {
    headers: [
      { value: "id", sort: true },
      { value: "firstname", sort: true },
      { value: "surname", sort: true }
    ],
    rows: [
      [{ value: 1 }, { value: "Robert" }, { value: "Johnson" }],
      [{ value: 2 }, { value: "Jane" }, { value: "Marsh" }],
      [{ value: 3 }, { value: "Sam" }, { value: "Jackson" }],
      [{ value: 4 }, { value: "Sarah" }, { value: "Lane" }],
      [{ value: 5 }, { value: "Ben" }, { value: "Parker" }],
      [{ value: 6 }, { value: "Peter" }, { value: "Aston" }],
      [{ value: 7 }, { value: "Mohammed" }, { value: "Rahman" }],
      [{ value: 8 }, { value: "Jack" }, { value: "Williamson" }],
      [{ value: 9 }, { value: "Winston" }, { value: "Mugile" }],
      [{ value: 10 }, { value: "Clare" }, { value: "Roberts" }],
      [{ value: 11 }, { value: "Kyle" }, { value: "McKinley" }],
      [{ value: 12 }, { value: "Luke" }, { value: "Starr" }],
      [{ value: 13 }, { value: "Dan" }, { value: "Boston" }],
      [{ value: 14 }, { value: "Paul" }, { value: "Pinal" }],
      [{ value: 15 }, { value: "Lewis" }, { value: "Moody" }],
      [{ value: 16 }, { value: "Morgan" }, { value: "Ponazi" }],
      [{ value: 17 }, { value: "Shanice" }, { value: "Jones" }],
      [{ value: 18 }, { value: "Thomas" }, { value: "Muller" }],
      [{ value: 19 }, { value: "William" }, { value: "D'Urban" }],
      [{ value: 20 }, { value: "Arthur" }, { value: "Morris" }],
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
