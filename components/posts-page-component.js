import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { _id } from "../api.js";
import { toggleLike } from "../api.js";
import { formatDistanceToNow } from "https://cdn.skypack.dev/date-fns";
import { ru } from "https://cdn.skypack.dev/date-fns/locale";
import { getToken } from "../index.js";
import { renderApp } from "../index.js";
const postDate = new Date("2024-06-01T10:00:00Z");
const result = formatDistanceToNow(postDate, { addSuffix: true, locale: ru });
export function renderPostsPageComponent({ appEl }) {
  appEl.innerHTML = `<div id="appPosts"></div>`;
  const list = document.getElementById("appPosts");

  // Функция экранирования HTML
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  if (Array.isArray(posts)) {
    const postsHtml = posts
      .map((post) => {
        const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
          addSuffix: true,
          locale: ru,
        });

        const escapedName = escapeHtml(post.user.name);
        const escapedDescription = escapeHtml(post.description);

        return `
          <li class="post">
            <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${escapedName}</p>
            </div>
            <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-likes">
              <button 
                data-post-id="${post.id}" 
                data-is-liked="${post.isLiked}" 
                class="like-button"
              >
                <img src="./assets/images/${
                  post.isLiked ? "like-active.svg" : "like-not-active.svg"
                }" alt="like icon">
              </button>
              <p class="post-likes-text">
                Нравится: <strong>${post.likes.length}</strong>
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${escapedName}</span>
              ${escapedDescription}
            </p>
            <p class="post-date">${formattedDate}</p>
          </li>
        `;
      })
      .join("");

    list.innerHTML = `
      <div class="page-container">
        <div class="header-container"></div>
        <ul class="posts">${postsHtml}</ul>
      </div>
    `;
  }

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  document.querySelectorAll(".post-header").forEach((userEl) => {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  });

  document.querySelectorAll(".like-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const postId = btn.dataset.postId;
      const token = getToken();

      const post = posts.find((p) => p.id === postId);
      if (!post) {
        console.error("Пост не найден по ID:", postId);
        return;
      }

      toggleLike({
        postId,
        token,
        isLiked: post.isLiked,
      })
        .then((likeResponse) => {
          const updatedPost = likeResponse.post;

          const index = posts.findIndex((p) => p.id === updatedPost.id);
          if (index !== -1) {
            posts[index] = updatedPost;
          }

          renderApp();
        })
        .catch((error) => {
          console.error("Ошибка при лайке:", error);
          alert("Требуется авторизация, чтобы поставить лайк");
        });
    });
  });
}
