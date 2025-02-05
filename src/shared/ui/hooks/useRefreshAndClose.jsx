import { useDispatch } from "react-redux";
import { closeModal } from "../../state/modalSlice";
import { refresh } from "../../state/refreshIndexSlice";

export default function useCloseAndRefresh() {
    const dispatch = useDispatch();

    const closeAndRefresh = async () => {
        dispatch(closeModal());
        dispatch(refresh())
    }

    return { closeAndRefresh }
}
