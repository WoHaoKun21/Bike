import * as constants from "../constants"
const initValues = {
    menuName: "首页"
}
const rootReducer = (state = initValues, action) => {
    switch (action.type) {
        case constants.CHANGENAME:
            return { ...state, menuName: action.menuName }
        default:
            return state;
    }
}
export { rootReducer }