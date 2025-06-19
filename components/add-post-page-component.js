import { _id } from "../api.js";
import { getToken } from "../index.js";
import { addNewPost } from "../api.js";
import { postImage } from "../api.js";
import { posts, goToPage } from "../index.js";
import { baseHost } from "../api.js";
let uploadedImageUrl = "";
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let selectedFile = null;
  let uploadedImageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div>Страница добавления поста</div>
        <div class="add-form">
          <input type="text" class="add-form-name" placeholder="Введите описание картинки" />
          <input type="file" id="image-input" />
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    const fileInputElement = document.getElementById("image-input");
    fileInputElement.addEventListener("change", async function () {
      selectedFile = this.files[0];
      if (selectedFile) {
        uploadedImageUrl = await postImage({ file: selectedFile });
        console.log("Сохранённый URL:", uploadedImageUrl);
      }
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const descriptionInput = document.querySelector(".add-form-name");
      const description = descriptionInput.value.trim();

      if (!description || !uploadedImageUrl) {
        alert("Введите описание и загрузите изображение.");
        return;
      }

      // ✅ Передаём всё через callback
      onAddPostClick({
        description,
        imageFile: selectedFile,
      });
    });
  };

  render();
}
