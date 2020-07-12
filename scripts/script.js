'use strict';

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];
console.log('dataBase', dataBase);

const modalAdd = document.querySelector('.modal__add'),
  addAd = document.querySelector('.add__ad'),
  modalBtnSubmit = document.querySelector('.modal__btn-submit'),
  modalSubmit = document.querySelector('.modal__submit'),
  catalog = document.querySelector('.catalog'),
  modalItem = document.querySelector('.modal__item'),
  modalBtnWarning = document.querySelector('.modal__btn-warning'),
  modalFileInput = document.querySelector('.modal__file-input'),
  modalFileBtn = document.querySelector('.modal__file-btn'),
  modalImgAdd = document.querySelector('.modal__image-add');

const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImgAdd.src;

const elementsModalSubmit = [...modalSubmit.elements].filter(
  (elem) => elem.tagName !== 'BUTTON' && elem.type !== 'submit'
);
const searchInput = document.querySelector('.search__input');

addAd.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
  closeModal(modalAdd);
});

modalSubmit.addEventListener('input', () => {
  const validForm = elementsModalSubmit.every((elem) => elem.value);
  modalBtnSubmit.disabled = !validForm;
  modalBtnWarning.style.display = validForm ? 'none' : '';
});

modalSubmit.addEventListener('submit', (event) => {
  event.preventDefault();
  const itemObj = {};
  let counter = 0;
  for (const elem of elementsModalSubmit) {
    itemObj[elem.name] = elem.value;
    itemObj.id = counter++;
  }
  itemObj.image = infoPhoto.base64;
  dataBase.push(itemObj);
  modalSubmit.reset();
  closeModal(modalAdd);
  saveDB();
  renderCard();
});

// Close Modal
function closeModal(modal) {
  modal.addEventListener('click', (event) => {
    if (
      event.target.classList.contains('modal__close') ||
      event.target === modal
    ) {
      modal.classList.add('hide');
      document.body.style.overflow = '';
      modalSubmit.reset();
      modalFileBtn.textContent = textFileBtn;
      modalImgAdd.src = srcModalImage;
    } else if (event.target === modalBtnSubmit) {
      modal.classList.add('hide');
      modalBtnWarning.style.display = '';
    }
  });

  const closeModalEsc = (event) => {
    if (event.key === 'Escape') {
      modal.classList.add('hide');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', closeModalEsc);
    }
  };
  document.addEventListener('keydown', closeModalEsc);
}

//Local Storage
const saveDB = () => {
  localStorage.setItem('awito', JSON.stringify(dataBase));
};

//Photo Load
const infoPhoto = {};

modalFileInput.addEventListener('change', (event) => {
  const target = event.target;

  const reader = new FileReader();

  const file = target.files[0];

  infoPhoto.filename = file.name;
  infoPhoto.size = file.size;

  reader.readAsBinaryString(file);

  reader.addEventListener('load', (event) => {
    if (infoPhoto.size < 200000) {
      modalFileBtn.textContent = infoPhoto.filename;
      infoPhoto.base64 = btoa(event.target.result);
      modalImgAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
    } else {
      modalFileBtn.textContent = 'Файл не должен привышать 200кб';
      modalFileInput.value = '';
      checkForm();
    }
  });
});

//Create Card after press Add
const renderCard = (DB = dataBase) => {
  catalog.textContent = '';
  DB.forEach((item, i) => {
    catalog.insertAdjacentHTML(
      'beforeend',
      `<li class='card' data-id='${i}'>
        <img class='card__image' src='data:image/jpeg;base64,${item.image}' alt='test' />
        <div class='card__description'>
        <h3 class='card__header'>${item.nameItem}</h3>
        <div class='card__price'>${item.costItem} Ꝑ</div>
        </div>
        </li>`
    );
  });
};

//Search Input
searchInput.addEventListener('input', () => {
  const valueSearch = searchInput.value.trim().toLowerCase();
  if (valueSearch.length > 2) {
    const result = dataBase.filter(
      (item) =>
        item.nameItem.toLowerCase().includes(valueSearch) ||
        item.descriptionItem.toLowerCase().includes(valueSearch)
    );
    console.log(result);
    renderCard(result);
  }
});

const openCardModal = function (index) {
  let item = dataBase[index];
  modalItem.textContent = '';
  modalItem.insertAdjacentHTML(
    'afterbegin',
    `<div class="modal__block">
      <h2 class="modal__header">Купить</h2>
      <div class="modal__content">
        <div>
          <img
            class="modal__image modal__image-item"
            src="data:image/jpeg;base64,${item.image}"
            alt="test"
          />
        </div>
        <div class="modal__description">
          <h3 class="modal__header-item">${item.nameItem}</h3>
          <p>Состояние: <span class="modal__status-item">${item.status}</span></p>
          <p>
            Описание:
            <span class="modal__description-item"
              >${item.descriptionItem}</span
            >
          </p>
          <p>Цена: <span class="modal__cost-item">${item.costItem} ₽</span></p>
          <button class="btn">Купить</button>
        </div>
      </div>
      <button class="modal__close">&#10008;</button>
    </div>`
  );
};

//Open Card Modal
catalog.addEventListener('click', (event) => {
  const target = event.target;

  if (target.closest('.card')) {
    const indexOfItem = target.closest('.card').getAttribute('data-id');
    modalItem.classList.remove('hide');
    openCardModal(indexOfItem);
  }
  closeModal(modalItem);
});

renderCard();
