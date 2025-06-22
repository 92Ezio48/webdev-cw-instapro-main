// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "V.Korolyov";
export const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;
import { updatePosts } from "./index.js";
import { renderApp } from "./index.js";
import { posts } from "./index.js";
export let _id = "";
export let updateID = (newID) => {
  _id = newID;
};
export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(`https://wedev-api.sky.pro/api/user/login`, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function getUserPosts({ userId }) {
  return fetch(
    `https://wedev-api.sky.pro/api/v1/V.Korolyov/instapro/user-posts/${userId}`,
    {
      method: "GET",
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка при загрузке постов");
    }
    return response.json().then((data) => {
      return data.posts;
    });
  });
}
export function getAllPosts() {
  return fetch(`https://wedev-api.sky.pro/api/v1/V.Korolyov/instapro/`, {
    method: "GET",
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error("Неверный логин или пароль");
      }
      return response.json();
    })
    .then((data) => {
      updatePosts(data.posts);
      renderApp();
    });
}

export function addNewPost({ token, description, imageUrl }) {
  return fetch("https://wedev-api.sky.pro/api/v1/V.Korolyov/instapro", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      description,
      imageUrl, // ✅ передаём ссылку на изображение, а не сам файл
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка при добавлении поста");
    }
    return response.json();
  });
}

export function postImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch("https://wedev-api.sky.pro/api/upload/image", {
    method: "POST",
    body: data,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка при загрузке изображения");
      }
      return response.json();
    })
    .then((data) => {
      return data.fileUrl; // должен быть https://wedev-api.sky.pro/uploads/abc.jpg
    });
}

export function toggleLike({ postId, token, isLiked }) {
  const method = "POST";
  const action = isLiked ? "dislike" : "like";

  return fetch(
    `https://wedev-api.sky.pro/api/v1/V.Korolyov/instapro/${postId}/${action}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Ошибка при переключении лайка");
    }
    return response.json(); // возвращает объект { post: { ... } }
  });
}
