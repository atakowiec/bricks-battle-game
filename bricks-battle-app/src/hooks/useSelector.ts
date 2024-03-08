import {useSelector} from "react-redux";
import {State} from "../store";

export default useSelector<State> as <T>(selector: (state: State) => T) => T;
