import { renderTag } from "./render.js";

export class Modal {
  constructor(options) {
    this.isOpen = false;
    this.containerTag = (options && options.containerTag) || "#modal";
    this.containerContentTag = (options && options.containerContentTag) || "#modal-content-block";
    this.container = null;
    this.modal = null;
  }

  init() {
    // модальное окно без контента

    this.container = document.querySelector(this.containerTag);

    const modalBlock = renderTag("div", { class: "modal modal-hidden" });
    const modalContent = renderTag("div", { class: "modal-content" });
    const modalCloseBlock = renderTag("div", { style: "text-align:right" });
    const modalCloseIcon = renderTag("span", { class: "modal-close" });
    modalCloseBlock.append(modalCloseIcon);
    modalContent.append(modalCloseBlock);
    modalContent.append(renderTag("div", { id: this.containerContentTag.replace("#", "") }));
    modalBlock.append(modalContent);

    this.container.innerHTML = "";
    this.container.append(modalBlock);

    modalCloseBlock.onclick = this.close.bind(this);
  }

  render(content = renderTag("div"), immediatelyShow = true) { //перерисовываем модальное окно и тут же открываем
    const contentBlock = document.querySelector(this.containerContentTag);
    contentBlock.innerHTML = "";
    contentBlock.append(content);

    if (immediatelyShow) {
      this.open();
    }
  }

  close() {
    const modalBlock = document.querySelector(`${this.containerTag} > div`);
    modalBlock.classList.remove("modal-shown");
    modalBlock.classList.add("modal-hidden");
  }

  open() {
    const modalBlock = document.querySelector(`${this.containerTag} > div`);
    modalBlock.classList.add("modal-shown");
    modalBlock.classList.remove("modal-hidden");
  }
}
