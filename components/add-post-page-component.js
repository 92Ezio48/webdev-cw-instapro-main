import { _id } from "../api.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "../helpers.js";
import { postImage } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderPostsPageComponent } from "./posts-page-component.js";
let uploadedImageUrl = "";
export function renderAddPostPageComponent({ appEl, onAddPostClick, token }) {
  let selectedFile = null;
  let uploadedImageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <h2>Страница добавления поста</h2>
        <div class="form-container">
          <input type="text" class="add-form-name" placeholder="Введите описание картинки" />
          <input type="file" id="image-input" />
        </div>
        <button class="button" id="add-button">Добавить</button>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
      user: getUserFromLocalStorage(),
    });

    const fileInputElement = document.getElementById("image-input");
    fileInputElement.addEventListener("change", async function () {
      selectedFile = this.files[0];
      if (selectedFile) {
        try {
          uploadedImageUrl = await postImage({ file: selectedFile });
        } catch (error) {
          alert("Ошибка загрузки изображения");
          console.error(error);
        }
      }
    });

    document
      .getElementById("add-button")
      .addEventListener("click", async () => {
        const descriptionInput = document.querySelector(".add-form-name");
        const description = descriptionInput.value.trim();

        if (!description || !selectedFile) {
          alert("Введите описание и выберите файл.");
          return;
        }

        try {
          // 👉 Дождись завершения добавления поста
          await onAddPostClick({
            description,
            imageFile: selectedFile,
          });

          // 👉 Только потом обнови страницу постов
          await renderPostsPageComponent({ appEl, token });
        } catch (error) {
          alert("Ошибка при добавлении поста");
          console.error(error);
        }
      });
  };

  render();
}
