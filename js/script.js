const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getUser(search.value);
});

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);
    createUserCard(data);
    getRepos(username);
    // getFollowers(data.followers_url);
    getFollowing(username);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard("No profile with that username");
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
    addReposToCard(data);
  } catch (err) {
    createErrorCard("Some problems fetching user repos");
  }
}

async function getFollowers(followers_url) {
  try {
    const { data } = await axios(followers_url);
    addFollowersToCard(data);
  } catch (err) {
    createErrorCard("Some problems fetching user followers");
  }
}

async function getFollowing(username) {
  following_url = `https://api.github.com/users/${username}/following`;
  try {
    const { data } = await axios(following_url);
    console.log(data)
    addFollowingToCard(data);
  } catch (err) {
    createErrorCard("Some problems fetching user followers");
  }
}

function addFollowingToCard(data) {
  const followersEl = document.getElementById("following");
  const ourUL = document.createElement("div");

  data.slice(0, 5).forEach((follower) => {
    const repoEl = document.createElement("div");
    repoEl.innerHTML = `
      <div  style="display: flex; align-items: center;">
        <div class="col s1" style="padding-right: 1rem;">
          <img src="${follower.avatar_url}" alt="" style="display: block; width: 40px; height: 40px;" />
        </div>
        <div class="col s11">
          <h5>${follower.login}</h5>
        </div>
      </div>
    `;
    ourUL.appendChild(repoEl);
  });
  followersEl.appendChild(ourUL);
}

function addReposToCard(data) {
  const reposEl = document.getElementById("repos");
  const ourUL = document.createElement("ul");

  // console.log(data);
  data.slice(0, 5).forEach((repo) => {
    const anc = document.createElement("a");
    anc.classList.add("repo");
    anc.target = "_blank";
    anc.innerText = repo.name;
    const repoEl = document.createElement("li").appendChild(anc);
    ourUL.appendChild(repoEl);
  });
  reposEl.appendChild(ourUL);
}

function addFollowersToCard(data) {
  const followersEl = document.getElementById("followers");
  const ourUL = document.createElement("div");

  data.slice(0, 5).forEach((follower) => {
    const repoEl = document.createElement("div");
    repoEl.innerHTML = `
      <div  style="display: flex; align-items: center;">
        <div class="col s1" style="padding-right: 1rem;">
          <img src="${follower.avatar_url}" alt="" style="display: block; width: 40px; height: 40px;" />
        </div>
        <div class="col s11">
          <h5>${follower.login}</h5>
        </div>
      </div>
    `;
    ourUL.appendChild(repoEl);
  });
  followersEl.appendChild(ourUL);
}


function createErrorCard(message) {
  const cardHTML = `
  <div class="card">
        <h1>${message}</h1>
  </div>
  `;
  main.innerHTML = cardHTML;
}

function createUserCard(user) {
  const userID = user.login || user.name;
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHTML = `
        <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${userID}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${userID}</h2>
                ${userBio}
                <ul>
                    <li>
                        ${user.followers}
                        <strong>Followers</strong>
                    </li>
                    <li>
                        ${user.following}
                        <strong>Following</strong>
                    </li>
                    <li>
                       ${user.public_repos}
                       <strong>Repos</strong>
                    </li>
                </ul>
                <div id="repos">
                </div>
                <div id="followers">
                  <h2>Followers</>
                </div>  
                <div id="following">
                    <h2>Following</>
                </div>  
            </div>
             
        </div>
  `;

  main.innerHTML = cardHTML;
}
