import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import logo from "../images/logo.svg";
import avatar from "../images/avatar.jpg";
import pencil from "../images/pencil.svg";
import plus from "../images/plus.svg";
import close from "../images/close.svg";
//import closeLight from "../images/close-light.svg";
import pencilWhite from "../images/pencil-light.svg";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const imageLogo = document.getElementById("image-logo");
imageLogo.src = logo;
const imageAvatar = document.getElementById("image-avatar");
imageAvatar.src = avatar;
const imagePencil = document.getElementById("image-pencil");
imagePencil.src = pencil;
const imagePlus = document.getElementById("image-plus");
imagePlus.src = plus;
/*const imageClose = document.getElementById("image-close");
imageClose.src = close;*/
//const lightClose = document.getElementById("image-close");
//lightClose.src = closeLight;
const pencilLight = document.getElementById("pencil-light");
pencilLight.src = pencilWhite;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "779aff47-9f97-4f59-ab86-c412269b098c",
    "Content-Type": "application/json",
  },
});

//Destructure the second item in the callback of the .then()
api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });
    //Handle the user's info
    // - set the src of the avatar image
    // - set the textContent of both the text elements
    imageAvatar.src = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
  })
  .catch((err) => {
    console.error(err);
  });

const profileEditButton = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

const editModal = document.querySelector("#edit-profile-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseButton = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

//Cards
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

//Avatar form
const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

//Delete form
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCancel = deleteModal.querySelector(".modal__cancel-btn");
const deleteClose = deleteModal.querySelector(".modal__close_delete");

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalClose = previewModal.querySelector(".modal__close-btn");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}
deleteCancel.addEventListener("click", () => {
  closeModal(deleteModal);
});
deleteClose.addEventListener("click", () => {
  closeModal(deleteModal);
});

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

function handleLike(evt, id) {
  //1. check whether card is currently liked or not
  //2. call the changeLike methods, passing it to the appropriate arguments
  //3. handle the response (.then and .catch)
  //4. in the .then, toggle active class
  const isLiked = evt.target.classList.contains("card__like-btn_liked");

  api
    .changeLike(id, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-btn_liked");
    })
    .catch(console.error);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameElement = cardElement.querySelector(".card__title");
  const cardImageElement = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  //TODO - if the card is liked, set the active class to the card
  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardNameElement.textContent = data.name;
  cardImageElement.src = data.link;
  cardImageElement.setAttribute("alt", data.name);

  cardLikeBtn.addEventListener("click", (evt) =>
    //cardLikeBtn.classList.toggle("card__like-btn_liked");
    handleLike(evt, data._id)
  );

  cardDeleteBtn.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  cardImageElement.addEventListener("click", () => {
    openModal(previewModal);
    previewModalCaption.textContent = data.name;
    previewModalImage.src = data.link;
    previewModalImage.setAttribute("alt", data.name);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape);
  modal.addEventListener("mousedown", handleOverlay);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape);
  modal.removeEventListener("mousedown", handleOverlay);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);
  //submitBtn.textContent = "Saving...";

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;

      closeModal(editModal);
      editFormElement.reset();
      disableButton(submitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

//TODO - implement loadng text for all other form submissions

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .createCards(inputValues)
    .then((newCard) => {
      const cardEl = getCardElement(newCard);
      cardsList.prepend(cardEl);

      disableButton(cardSubmitBtn, settings);

      closeModal(cardModal);
      cardForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });

  /*disableButton(cardSubmitBtn, {
    inactiveButtonClass: "modal__submit-btn_disabled",
  });*/
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true);

  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      //TODO - Use data argument instead of the input values
      profileName.textContent = data.name; //editModalNameInput.value;
      profileDescription.textContent = data.about; //editModalDescriptionInput.value;
      imageAvatar.src = data.avatar;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false);
    });
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    closeModal(modal);
  }
}

function handleOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

editFormElement.addEventListener("submit", handleEditFormSubmit);

editModalCloseButton.addEventListener("click", () => {
  closeModal(editModal);
});

cardForm.addEventListener("submit", handleAddCardSubmit);

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

// Select avatar modal button
avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarSubmitBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

previewModalClose.addEventListener("click", () => {
  closeModal(previewModal);
});

/*initialCards.forEach((item) => {
  const cardEl = getCardElement(item);
  cardsList.append(cardEl);
});*/

enableValidation(settings);
