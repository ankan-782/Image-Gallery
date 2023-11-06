import { useContext } from "react";
import { LocalStorageContext } from "../contexts/LocalStorageContextProvider";

export default function useLocalStorageImageValues() {
    return useContext(LocalStorageContext);
}