import { RoutePlanner } from "./route-planner.js";
import importedPortals from './portals.js';

const page = document.querySelector(".page")

const params = new URLSearchParams(window.location.search);
const planner = new RoutePlanner(importedPortals);

const result = planner.findRoutes(params.get("from"), params.get("to")).display();
page.textContent = result;