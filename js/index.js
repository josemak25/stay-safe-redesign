const menu = document.querySelector(".menu");
const pageContainer = document.querySelector("body");
const menuListItem = menu.children[0].children;

// HANDLE MENU EVENT
const closeMobileMethod = function () {
  Array.from(menuListItem).forEach((item) => item.classList.remove("active"));
  this.classList.toggle("active");
  setTimeout(() => pageContainer.classList.remove("menu-show"), 300);
  const contentID = this.children[0].attributes[0].value;

  $("html,body").animate({ scrollTop: $(contentID).offset().top }, "slow");
};

if (pageContainer.clientWidth <= 1024) {
  Array.from(menuListItem).forEach((item) => {
    item.addEventListener("click", closeMobileMethod);
  });
}
