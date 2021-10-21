import { createContext } from "react";
const globalContextDefaultData = {
	language: {},
};
const QnnReactCronContext = createContext(globalContextDefaultData);
export default QnnReactCronContext;
