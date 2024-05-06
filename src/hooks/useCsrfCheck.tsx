import { useDispatch, useSelector } from "react-redux";
import { setCsrfTokenState } from "../reducers/CsrfTokenReducer";
import { RootStateInterface } from "../types/reducers/RootStateInterface";


function useCsrfCheck() {
    const dispatch = useDispatch();
    const token = useSelector((state: RootStateInterface) => state.csrfToken.token);
    
    const issue = (length: number) => {
        const token = generate(length);
        dispatch(setCsrfTokenState({ token }));

        return token;
    }

    const compare = (paramToken: string) => {
        return paramToken === token;
    }

    const reset = () => {
        dispatch(setCsrfTokenState({ token: '' }))
    }

    return { issue, compare, reset }
}

export default useCsrfCheck;

const generate = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let result = '';

    for (let i = 0; i < length; i++) result += characters[Math.floor(Math.random() * characters.length)];

    return result;
}