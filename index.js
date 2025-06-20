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
export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

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
export const goToPage = (newPage, data) => {
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
      console.log("Открываю страницу пользователя: ", user.name);
      page = USER_POSTS_PAGE;
      posts = [];
      return renderApp();
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

export const renderApp = () => {
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
      onAddPostClick({ description, imageFile }) {
        console.log("Добавляю пост...", { description, imageFile });

        postImage({ file: imageFile })
          .then((imageUrl) => {
            console.log("URL загруженного изображения:", imageUrl);

            return addNewPost({
              token: getToken(),
              description: description,
              imageUrl: imageUrl, // ✅ передаём URL
            });
          })
          .then(() => {
            console.log("Пост успешно добавлен");
          })
          .catch((error) => {
            alert("Не удалось загрузить пост");
            console.error(error);
          });
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
    const userName = user.name; // ⚠️ Подставь реальное имя из данных пользователя
    appEl.innerHTML = `
    <h2>Страница пользователя: ${userName}</h2>
  `;
    return;
  }
};

goToPage(POSTS_PAGE);
getAllPosts();
