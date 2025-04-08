// save the theme to the local storage so that everytime we referesh we still have the theme

import {create} from 'zustand'

export const useThemeStore = create((set) => ({
    //theme: "coffee", // doesn't use the local storage so
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme: (theme) => {
    // first set the localstorage with the theme 
    localStorage.setItem("chat-theme", theme), // after this update the theme
        set({theme})
    }
}));