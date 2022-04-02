import * as constants from "../constants";
export const changeName = (menuName) => ({
    type: constants.CHANGENAME,
    menuName
})