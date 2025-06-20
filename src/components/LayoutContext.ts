import { createContext, useContext } from "react";

import Layout from "../lib/Layout";
import { flat } from "../lib/Orientation";
import Point from "../lib/Point";

const LayoutContext = createContext(new Layout(flat, new Point(32, 32)));
export default LayoutContext;

export const useLayout = () => useContext(LayoutContext);
