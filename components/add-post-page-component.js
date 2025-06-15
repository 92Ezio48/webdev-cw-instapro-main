import { _id } from "../api.js";
import { getToken } from "../index.js";
import { addNewPost } from "../api.js";
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // @TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      Cтраница добавления поста
      <button class="button" id="add-button">Добавить</button>
    </div>
            <div class="add-form">
                <input
                    type="text"
                    class="add-form-name"
                    placeholder="Введите текст"
                />
                <textarea
                    type="textarea"
                    class="add-form-text"
                    placeholder="Введите ваш коментарий"
                    rows="4"
                ></textarea>
            </div>
        </div>
  `;

    appEl.innerHTML = appHtml;

    document.getElementById("add-button").addEventListener("click", () => {
      const newPost = {
        id: _id,
        imageUrl:
          "https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680601903167-%25C3%2590%25C2%25A1%25C3%2590%25C2%25BD%25C3%2590%25C2%25B8%25C3%2590%25C2%25BC%25C3%2590%25C2%25BE%25C3%2590%25C2%25BA%2520%25C3%2591%25C2%258D%25C3%2590%25C2%25BA%25C3%2591%25C2%2580%25C3%2590%25C2%25B0%25C3%2590%25C2%25BD%25C3%2590%25C2%25B0%25202023-03-31%2520%25C3%2590%25C2%25B2%252012.45.42.png",
        createdAt: "2023-04-04T09:51:47.187Z",
        description: "Это я",
        user: {
          id: "642bf323b959b2a4679f2e68",
          name: "Глеб Фокин",
          login: "glebkaf777",
          imageUrl:
            "https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680601877737-%25C3%2590%25C2%25A1%25C3%2590%25C2%25BD%25C3%2590%25C2%25B8%25C3%2590%25C2%25BC%25C3%2590%25C2%25BE%25C3%2590%25C2%25BA%2520%25C3%2591%25C2%258D%25C3%2590%25C2%25BA%25C3%2591%25C2%2580%25C3%2590%25C2%25B0%25C3%2590%25C2%25BD%25C3%2590%25C2%25B0%25202023-03-31%2520%25C3%2590%25C2%25B2%252012.58.33.png",
        },
        likes: [
          { id: "642bf323b959b2a4679f2e68", name: "Глеб Фокин" },
          { id: "64226edb0cdb1574f162d950", name: "Глеб Админ" },
          { id: "64255dabca1ce2a815a327d7", name: "Глеб" },
        ],
        isLiked: false,
      };
      addNewPost({ token: getToken() })
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          } else {
            if (response.status === 500) {
              throw new Error("Сервер упал");
            }
            if (response.status === 400) {
              throw new Error(
                "Имя и комментарий должны быть не короче 3-х символов"
              );
            }
            if (response.status === 401) {
              throw new Error("Необходима авторизация!");
            }
          }
        })
        .catch((Error) => {
          alert(Error);
        });
      onAddPostClick({
        description: "Этот котик очень красивый",
        imageUrl:
          "https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680601502867-%25C3%2590%25C2%25A1%25C3%2590%25C2%25BD%25C3%2590%25C2%25B8%25C3%2590%25C2%25BC%25C3%2590%25C2%25BE%25C3%2590%25C2%25BA%2520%25C3%2591%25C2%258D%25C3%2590%25C2%25BA%25C3%2591%25C2%2580%25C3%2590%25C2%25B0%25C3%2590%25C2%25BD%25C3%2590%25C2%25B0%25202023-04-04%2520%25C3%2590%25C2%25B2%252014.04.29.png",
      });
    });
  };

  render();
}
