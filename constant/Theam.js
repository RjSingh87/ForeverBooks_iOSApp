import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
export const COLORS = {
    // base colors
    primary: "#4A40A1", // purple
    secondary: "#EAE8FF",   // lightpurple

    // textColor colors
    black: "#000000",
    white: "#FFFFFF",
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,
    // app dimensions
    width,
    height
};
export const FONTS = {
    rupeeFont : {fontFamily:'../assets/Fonts/Rupee_Foradian.ttf'} 
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
