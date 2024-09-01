function addWidget() {
  const isSymbolsPage = /^https:\/\/in\.tradingview\.com\/symbols\/.*$/.test(
    window.location.href
  );

  if (isSymbolsPage) {
    const sideBar = document.getElementsByClassName("filler-GfsAWtWz")[0];
    const addWidgetContainer = document.getElementsByClassName(
      "chartTypeControlsWrapper-nORFfEfo"
    )[0];

    if (sideBar && addWidgetContainer) {
      // Add logo button
      const logo = document.createElement("div");
      logo.innerHTML = `<h1 id="logoW">W</h1>`;
      sideBar.appendChild(logo);

      // Add widget with green background button
      const widget = document.getElementsByClassName("widgetButton")[0];
      widget.addEventListener("click", () => {
        let fullChartLink;
        if (
          document.getElementsByClassName("mobileFullChartButton-nORFfEfo")
            .length > 0
        ) {
          fullChartLink = document.getElementsByClassName(
            "mobileFullChartButton-nORFfEfo"
          )[0];
        } else {
          fullChartLink = document.getElementsByClassName(
            "desktopFullChartButton-nORFfEfo"
          )[0];
        }

        const chartLink = fullChartLink?.querySelector("a")?.href;
        const symbol =
          document.getElementsByClassName("item-JLr4OyLc")[0]?.textContent;
        const stockImg = document
          .getElementsByClassName("container-xoKMfU7r")[0]
          .querySelector("img").src;
        const data = { symbol, chartLink, stockImg };
        if (chartLink) {
          addStockToSelectedWatchlist(data);
        }
      });
    }
  }
}

function watchListContainer() {
  const watchListContainer = document.createElement("div");
  watchListContainer.classList.add("watchlistContainer");
  watchListContainer.classList.add("display-hidden");

  // Add watchlist selection UI
  watchListContainer.innerHTML = `
   <div>
    <p style="margin-bottom:10px">Watch Pro</p>
    <select id="watchlistSelector" >
    </select>
    <div style="display:flex; gap:5px">
    <button id="createWatchlist">Create New Watchlist</button>
     <div class="widgetButton">
        <button style="background-color: #28a745;">+
        </button></div></div></div>
    <div id="stocksContainer"></div>
    
  `;
  watchListContainer.querySelector("select").addEventListener("change", (e) => {
    setLastSelectedWatchlist(e.target.value);
  });

  document.body.appendChild(watchListContainer);

  // Populate the dropdown with watchlists
  populateWatchlistDropdown();

  // Add event listener for creating new watchlists
  document
    .getElementById("createWatchlist")
    .addEventListener("click", createNewWatchlist);
}

function setLastSelectedWatchlist() {
  const selectedWatchlistIndex = watchlistSelector.value;
  localStorage.setItem("selectedWatchlist", selectedWatchlistIndex);
}

function createNewWatchlist() {
  const watchlistName = prompt("Enter the name of the new watchlist:");
  if (watchlistName) {
    let watchlists = JSON.parse(localStorage.getItem("watchlists")) || [];
    watchlists.push({ name: watchlistName, stocks: [] });
    localStorage.setItem("watchlists", JSON.stringify(watchlists));
    populateWatchlistDropdown();
  }
}

function populateWatchlistDropdown() {
  const watchlistSelector = document.getElementById("watchlistSelector");
  const watchlists = JSON.parse(localStorage.getItem("watchlists")) || [
    { name: "Default", stocks: [] },
  ];
  watchlistSelector.innerHTML = "";
  watchlists.forEach((watchlist, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = watchlist.name;
    if (index == localStorage.getItem("selectedWatchlist")) {
      option.selected = true;
    } else {
      option.selected = false;
    }
    watchlistSelector.appendChild(option);
  });

  // Load the selected watchlist's stocks
  watchlistSelector.addEventListener("change", loadSelectedWatchlistStocks);
  loadSelectedWatchlistStocks(); // Load stocks for the default selection
}

function loadSelectedWatchlistStocks() {
  const watchlistSelector = document.getElementById("watchlistSelector");
  const selectedWatchlistIndex = localStorage.getItem("selectedWatchlist") || 0;
  const watchlists = JSON.parse(localStorage.getItem("watchlists")) || [];
  const stocksContainer = document.getElementById("stocksContainer");

  stocksContainer.innerHTML = "";

  if (watchlists[selectedWatchlistIndex]) {
    watchlists[selectedWatchlistIndex].stocks.forEach((stockData) => {
      const stock = document.createElement("div");
      stock.classList.add("stockItem");
      stock.innerHTML = `<a href="${stockData.chartLink}" target="_blank"><div style ="display:flex; gap: 5px">
      <img src = "${stockData.stockImg}" class="tv-circle-logo--xxxsmall-PsAlMQQF"><p>${stockData.symbol}</p></div></a><span class = "button-w6lVe_oI removeButton-RsFlttSS">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"  class = "removeStock"><path fill="currentColor" d="M12 4h3v1h-1.04l-.88 9.64a1.5 1.5 0 0 1-1.5 1.36H6.42a1.5 1.5 0 0 1-1.5-1.36L4.05 5H3V4h3v-.5C6 2.67 6.67 2 7.5 2h3c.83 0 1.5.67 1.5 1.5V4ZM7.5 3a.5.5 0 0 0-.5.5V4h4v-.5a.5.5 0 0 0-.5-.5h-3ZM5.05 5l.87 9.55a.5.5 0 0 0 .5.45h5.17a.5.5 0 0 0 .5-.45L12.94 5h-7.9Z"></path></svg></span>`;
      stocksContainer.appendChild(stock);
    });
  }
}

function addStockToSelectedWatchlist(data) {
  let watchlists = JSON.parse(localStorage.getItem("watchlists")) || [
    { name: "Default", stocks: [] },
  ];
  const selectedWatchlistIndex = localStorage.getItem("selectedWatchlist") || 0;

  if (watchlists[selectedWatchlistIndex]) {
    let isDuplicate = watchlists[selectedWatchlistIndex].stocks.some(
      (stock) => stock.symbol === data.symbol
    );

    if (!isDuplicate) {
      watchlists[selectedWatchlistIndex].stocks.push(data);
      localStorage.setItem("watchlists", JSON.stringify(watchlists));
      loadSelectedWatchlistStocks(); // Refresh the stocks display
    } else {
      alert("Stock already exists in this watchlist!");
    }
  }
}

function removeStockFromWatchlist(symbol, currWatchlist) {
  let watchlists = JSON.parse(localStorage.getItem("watchlists"));

  watchlists[currWatchlist].stocks = watchlists[currWatchlist].stocks.filter(
    (stock) => stock.symbol !== symbol
  );

  localStorage.setItem("watchlists", JSON.stringify(watchlists));
}

// Initialize everything
watchListContainer();
addWidget();

const toggle = document.getElementById("logoW");
toggle?.addEventListener("click", () => {
  const watchListContainer =
    document.getElementsByClassName("watchlistContainer")[0];
  watchListContainer.classList.toggle("display-hidden");
});

//remove stock from watchlist
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeStock")) {
    const symbol =
      e.target.parentElement.parentElement.querySelector("p").textContent;
    const currWatchlist =
      JSON.parse(localStorage.getItem("selectedWatchlist")) || 0;
    removeStockFromWatchlist(symbol, currWatchlist);
    e.target.parentElement.parentElement.remove();
  }
});
