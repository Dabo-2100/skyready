import { atom } from "recoil";

export const $Server = atom({
  key: "$Server",
  default: window.location.href.includes("localhost")
    ? "http://localhost/skyready/public"
    : "",
});

export const $Token = atom({
  key: "$Token",
  default: sessionStorage.getItem("$Token") || localStorage.getItem("$Token"),
});

export const $LoaderIndex = atom({
  key: "$LoaderIndex",
  default: false,
});

export const $SwalDark = atom({
  key: "$SwalDark",
  default: {
    popup: "dark-theme",
    title: "dark-theme",
    content: "dark-theme",
    confirmButton: "dark-theme",
    cancelButton: "dark-theme",
  },
});
