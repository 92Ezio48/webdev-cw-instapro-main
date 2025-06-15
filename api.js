// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "V.Korolyov";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;
import { updatePosts } from "./index.js";
import { renderApp } from "./index.js";
import { renderPosts } from "./renderPostsFunction.js";
export let _id = "";
export let updateID = (newID) => {
  _id = newID;
  console.log(_id);
};
export function getPosts({ token }) {
  console.log("Посты получены");
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

export function getUserPosts() {
  return fetch(baseHost + `/user-posts/${_id}`, {
    method: "GET",
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
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
      console.log(data);
      updatePosts(data.posts);
      renderApp();
      renderPosts();
    });
}

export function addNewPost({ token }) {
  const data = JSON.stringify({
    description: `Этот котик очень красивый`,
    imageUrl: `https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680601502867-%25C3%2590%25C2%25A1%25C3%2590%25C2%25BD%25C3%2590%25C2%25B8%25C3%2590%25C2%25BC%25C3%2590%25C2%25BE%25C3%2590%25C2%25BA%2520%25C3%2591%25C2%258D%25C3%2590%25C2%25BA%25C3%2591%25C2%2580%25C3%2590%25C2%25B0%25C3%2590%25C2%25BD%25C3%2590%25C2%25B0%25202023-04-04%2520%25C3%2590%25C2%25B2%252014.04.29.png`,
  });
  return fetch(`https://wedev-api.sky.pro/api/v1/V.Korolyov/instapro/`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: data,
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный запрос");
    } else {
      if (response.status === 401) {
        throw new Error("Необходима авторизация!");
      }
    }
    return response.json();
  });
}
