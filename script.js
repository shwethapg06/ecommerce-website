const apikey = "8b9620907eec4880acee780d7f969bc2";
const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");

async function fetchRandomNews() {
  try {
    const apiUrl = `https://newsapi.org/v2/top-headlines?sources=techcrunch&pageSize=9&apiKey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.log("Error fetching random news", error);
    return [];
  }
}

searchBtn.addEventListener("click", async () => {
  const query = searchField?.value.trim();
  if (query !== "") {
    try {
      const articles = await fetchNewsQuery(query);
      if (articles) {
        displayBlogs(articles);
        localStorage.setItem("lastSearchQuery", query);
        localStorage.setItem("lastSearchResults", JSON.stringify(articles));
      } else {
        console.error("No articles found for the query");
      }
    } catch (error) {
      console.error("Error fetching news by query", error);
    }
  } else {
    console.error("Search query is empty");
  }
});

async function fetchNewsQuery(query) {
  try {
    const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=9&apiKey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.log("Error fetching news by query", error);
    return [];
  }
}

function displayBlogs(articles) {
  if (!articles) {
    console.error("No articles to display");
    return;
  }

  blogContainer.innerHTML = "";
  articles.forEach((article) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");
    const img = document.createElement("img");
    img.src = article.urlToImage;
    img.alt = article.title;

    const title = document.createElement("h2");
    const truncateTitle =
      article.title.length > 30
        ? article.title.slice(0, 30) + "..."
        : article.title;
    title.textContent = truncateTitle;

    const description = document.createElement("p");
    const truncatedDescription =
      article.description.length > 120
        ? article.description.slice(0, 120) + "..."
        : article.description;
    description.textContent = truncatedDescription;

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);

    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });

    blogContainer.appendChild(blogCard);
  });
}

(async () => {
  try {
    const lastSearchQuery = localStorage.getItem("lastSearchQuery");
    const lastSearchResults = localStorage.getItem("lastSearchResults");

    if (lastSearchQuery && lastSearchResults) {
      searchField.value = lastSearchQuery;
      const articles = JSON.parse(lastSearchResults);
      displayBlogs(articles);
    } else {
      const articles = await fetchRandomNews();
      displayBlogs(articles);
    }
  } catch (error) {
    console.error("Error fetching news", error);
  }
})();
