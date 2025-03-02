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

export const $Defaults = atom({
  key: "$Defaults",
  default: {
    status: [
      {
        status_id: 1,
        status_name: "Not Started",
        bgColor: "#B0BEC5",
        color: "black",
      },
      {
        status_id: 2,
        status_name: "In Progress",
        bgColor: "#42A5F5",
        color: "white",
      },
      {
        status_id: 3,
        status_name: "On Hold",
        bgColor: "#FFEB3B",
        color: "black",
      },
      {
        status_id: 4,
        status_name: "Completed",
        bgColor: "#66BB6A",
        color: "white",
      },
      { status_id: 5, status_name: "N/A", bgColor: "#AB47BC", color: "white" },
      {
        status_id: 6,
        status_name: "Waiting For Spare parts",
        bgColor: "#FFEB3B",
        color: "black",
      },
      {
        status_id: 7,
        status_name: "Waiting For Installation",
        bgColor: "#FFEB3B",
        color: "black",
      },
      {
        status_id: 8,
        status_name: "Waiting For Manpower",
        bgColor: "#FFEB3B",
        color: "black",
      },
      {
        status_id: 9,
        status_name: "Waiting For Findings",
        bgColor: "#FFEB3B",
        color: "black",
      },
      {
        status_id: 10,
        status_name: "Mixed Task",
        bgColor: "#FFEB3B",
        color: "black",
      },
      {
        status_id: 11,
        status_name: "Waiting For Tools",
        bgColor: "#FFEB3B",
        color: "black",
      },
      {
        status_id: 12,
        status_name: "Waiting For Mail",
        bgColor: "#FFEB3B",
        color: "black",
      },
      {
        status_id: 13,
        status_name: "Waiting For Painting",
        bgColor: "#FFEB3B",
        color: "black",
      },
    ],
    project_status_id: 2,
    task_status_id: 4,
    package_status_id: 5,
  },
});

export const $UserInfo = atom({
  key: "$UserInfo",
  default: {
    is_active: 0,
    user_email: "",
    user_name: "user",
    user_id: 0,
    user_roles: [],
  },
});

// Caching States
export const $AircraftModels = atom({
  key: "$AircraftModels",
  default: [],
});

export const $Fleet = atom({
  key: "$Fleet",
  default: {},
});
