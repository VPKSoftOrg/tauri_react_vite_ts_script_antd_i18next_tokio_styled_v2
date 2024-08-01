# Tauri + React + Vite + Typescript + antd + i18next + Tokio + Styled Components

This template should help get you started developing with [Tauri](https://tauri.app), [React](https://react.dev), [Vite](https://vitejs.dev), [Typescript](https://www.typescriptlang.org), [antd](https://ant.design), [i18next](https://www.i18next.com), [Styled Components](https://styled-components.com) and [Tokio](https://tokio.rs).

The template is for [Tauri version 2+](https://v2.tauri.app/), for the [Version 1 template here](https://github.com/VPKSoftOrg/tauri_react_vite_ts_script_antd_i18next_tokio_styled_v1).

## Recommended IDE Setup 1

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Recommended IDE Setup 2

- [RustRover](https://www.jetbrains.com/rust/)

## To use this template
After GitHub *Use this template*:
1. CD into `change-name-owner-src`
2. Run NPM install: `npm i`
3. Run the replace script:

   `node ./index.js --copyright [your company/your name] --appName [the application name] --initialVersion [0.0.1] --appUrl [the main url for the application web site] --sourceUrl [the source code url for the application source] --manualDownloadUri [an url where the application may be downloaded] --shortDescription [A short one-line description of the application]`

   Example:
   
   `node ./index.js --copyright VPKSoft --appName MyNewApp --initialVersion 0.1.0 --appUrl https://www.vpksoft.net --sourceUrl https://github.com/VPKSoft/MyNewApp --manualDownloadUri https://github.com/VPKSoft/MyNewApp/releases/latest --shortDescription "An app for something"` 

## Debug instructions to RustRover or Visual Studio Code
* [Visual Studio Code](https://github.com/VPKSoftOrg/tauri_react_vite_ts_script_antd_i18next_tokio_styled_v2/wiki/Visual-Studio-Code:-Run-and-Debug)
* [RustRover](https://github.com/VPKSoftOrg/tauri_react_vite_ts_script_antd_i18next_tokio_styled_v2/wiki/RustRover:-Run-and-debug)

## Features
Support for extendable application preferences and a popup for the mentioned purpose:  
![image](https://github.com/VPKSoftOrg/tauri_react_vite_ts_script_antd_i18next_tokio_styled/assets/40712699/0dc7b4e9-401e-4ed5-ab8d-4ac21ec38e6a) ![image](https://github.com/VPKSoftOrg/tauri_react_vite_ts_script_antd_i18next_tokio_styled/assets/40712699/b13b78a1-970e-491e-ac61-b58881bf6d30)




Support for localization which is totally optional.

For backend localization see the [additional readme](./src/localization/rust_i18n_transform/README.md).

The window title bar is custom. E.g. it looks the same with different operation systems:
![image](https://github.com/user-attachments/assets/ccaaabb1-45f1-481c-9a85-386e3bf58b43)

Also with dark mode support:
![image](https://github.com/user-attachments/assets/eb5040c9-b7d4-42a3-ba34-78a15b737ffd)

The application running on mobile:

![image](https://github.com/user-attachments/assets/f3208534-30ad-4c50-85f0-0cdf71138262) ![image](https://github.com/user-attachments/assets/9b267760-766e-4d3b-a21a-aa0ffeb4438e) 

The drawer menu on mobile:

![image](https://github.com/user-attachments/assets/e72993e1-ee66-4326-981f-346999265bca) ![image](https://github.com/user-attachments/assets/20eaf909-ac3e-4e4b-b42e-5246d03748d9)





Customizable tool bar and menu with React(antd) components.
