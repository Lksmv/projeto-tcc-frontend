import { SET_LOGIN, SET_LOGOUT } from "../../utils/constants";

export const authReducer = (state, action) => {
    switch (action.type) {
        case SET_LOGIN:
            return {
                ...state,
                isLoggedIn: true,
                userToken: action.payload.token
            };
        case SET_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userToken: null
            };
        default:
            return state;
    }
};

export default authReducer;