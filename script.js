const input = document.getElementById("searchInput");
const profile = document.getElementById("profile");
const repos = document.getElementById("repos");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

async function getUser() {
  const username = input.value;

  if (!username) return;

  loading.innerText = "Loading...";
  error.innerText = "";
  profile.innerHTML = "";
  repos.innerHTML = "";

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);

    if (!res.ok) {
      throw new Error("User not found");
    }

    const data = await res.json();

    showProfile(data);
    getRepos(data.repos_url);

  } catch (err) {
    error.innerText = err.message;
  }

  loading.innerText = "";
}

function showProfile(user) {
  profile.innerHTML = `
    <div class="card">
      <img src="${user.avatar_url}" />
      <h2>${user.name || user.login}</h2>
      <p>${user.bio || "No bio available"}</p>
      <p>Joined: ${new Date(user.created_at).toDateString()}</p>
      <a href="${user.html_url}" target="_blank">Visit Profile</a>
    </div>
  `;
}

async function getRepos(url) {
  const res = await fetch(url);
  const data = await res.json();

  const latest = data.slice(0, 5);

  repos.innerHTML = "<h3>Top Repositories</h3>";

  latest.forEach(repo => {
    repos.innerHTML += `
      <div class="card">
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      </div>
    `;
  });
}