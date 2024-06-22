import { saveControlArea } from './mapScript.js';
import navFunction from './navScript.js';
// Attach the function to the global window object

navFunction();

window.saveControlArea = saveControlArea;