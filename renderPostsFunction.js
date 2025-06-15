import { posts } from "./postsData.js";
export const list = document.getElementById("appPosts");
console.log(list);
export const renderPosts = () => {
  if (Array.isArray(posts)) {
    const postsHtml = posts

      .map((post) => {
        `<div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  <li class="post">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${post.imageUrl}" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${post.id}" class="like-button">
                        <img src="./assets/images/like-active.svg">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${post.likes}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                     ${post.description}
                    </p>
                    <p class="post-date">
                      19 минут назад
                    </p>
                  </li>`;
      })
      .join(``);
    list.innerHTML = postsHtml;
    console.log(postsHtml);
    console.log(list);
  }
};
