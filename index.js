import { getPosts } from "../api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";
import { getAllPosts } from "./api.js";
import { addNewPost } from "../api.js";
import { postImage } from "../api.js";
import { renderHeaderComponent } from "./components/header-component.js";
import { getUserPosts } from "../api.js";
import { formatDistanceToNow } from "https://cdn.skypack.dev/date-fns";
import { ru } from "https://cdn.skypack.dev/date-fns/locale";
export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const updatePosts = (newPosts) => {
  posts = newPosts;
};

export const getToken = () => {
  const token = user ? `${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data = {}) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      /* Если пользователь не авторизован, то отправляем его на страницу авторизации перед добавлением поста */
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();
      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      page = USER_POSTS_PAGE;
      posts = [];
      return renderApp(data);
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

export const renderApp = (pageData = {}) => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick: async ({ description, imageFile }) => {
        try {
          const imageUrl = await postImage({ file: imageFile });

          await addNewPost({
            token: getToken(),
            description,
            imageUrl,
          });

          // ✅ Переход на страницу постов с обновлением
          goToPage(POSTS_PAGE);
        } catch (error) {
          alert("Не удалось загрузить пост");
          console.error(error);
        }
      },
      token: user.token,
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      posts,
    });
  }

  if (page === USER_POSTS_PAGE) {
    const userId = pageData.userId;
    appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      <h2>Загрузка...</h2>
    </div>
  `;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    getUserPosts({ userId })
      .then((userPosts) => {
        const userName = escapeHtml(userPosts[0]?.user.name || "Пользователь");

        const postsHtml = userPosts
          .map((post) => {
            const formattedDate = formatDistanceToNow(
              new Date(post.createdAt),
              {
                addSuffix: true,
                locale: ru,
              }
            );

            const escapedUserName = escapeHtml(post.user.name);
            const escapedDescription = escapeHtml(post.description);

            return `
<li class="post">
  <div class="post-header" data-user-id="${post.user.id}">
    <img src="${post.user.imageUrl}" class="post-header__user-image">
    <p class="post-header__user-name">${escapedUserName}</p>
  </div>
  <div class="post-image-container">
    <img class="post-image" src="${post.imageUrl}">
  </div>
  <div class="post-likes">
    <p class="post-likes-text">Нравится: <strong>${
      post.likes.length
    }</strong></p>
  </div>
  <p class="post-text">
    <span class="user-name">${escapedUserName}</span>
    ${escapedDescription}
  </p>
  ${
    post.tags && post.tags.length > 0
      ? `
    <div class="post-tags">
      <strong>Теги:</strong>
      ${post.tags
        .map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`)
        .join(" ")}
    </div>
  `
      : ""
  }
  <p class="post-date">${formattedDate}</p>
</li>
`;
          })
          .join("");

        appEl.innerHTML = `
        <div class="page-container">
          <div class="header-container"></div>
          <h2>Страница пользователя: ${userName}</h2>
          <ul class="posts">${postsHtml}</ul>
        </div>
      `;

        renderHeaderComponent({
          element: document.querySelector(".header-container"),
        });
        document.querySelectorAll(".post-header").forEach((element) => {
          element.addEventListener("click", () => {
            const userId = element.dataset.userId;
            goToPage(USER_POSTS_PAGE, { userId });
          });
        });
      })
      .catch((error) => {
        console.error("Ошибка загрузки постов пользователя:", error);
        appEl.innerHTML = `
        <div class="page-container">
          <div class="header-container"></div>
          <h2>Ошибка загрузки постов пользователя</h2>
        </div>
      `;

        renderHeaderComponent({
          element: document.querySelector(".header-container"),
        });
      });

    return;
  }
};

goToPage(POSTS_PAGE);
getAllPosts();
