import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import file from './lib/file';
import filePath from './lib/fileLocations';


var win = nw.Window.get();
win.resizeTo(1500, 800)
win.on('close', function () {
  close();
});

function close() {
  console.log("hello");
  file.createFile(filePath("machineGo"), "Not empty");
  win.close(true);
  window.close(true);
}


// win.maximize()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
