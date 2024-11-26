import * as React from "react";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { exit } from "@tauri-apps/plugin-process";
import { styled } from "styled-components";
import { Button, Drawer, Form, Input } from "antd";
import classNames from "classnames";
import { type } from "@tauri-apps/plugin-os";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { StyledTitle } from "./components/app/WindowTitle";
import { useTranslate } from "./localization/Localization";
import { type MenuKeys, appMenuItems } from "./menu/MenuItems";
import { AboutPopup } from "./components/popups/AboutPopup";
import { PreferencesPopup } from "./components/popups/PreferencesPopup";
import { useSettings } from "./utilities/app/Settings";
import { useWindowStateSaver } from "./hooks/UseWindowStateListener";
import { useAntdTheme, useAntdToken } from "./context/AntdThemeContext";
import type { CommonProps } from "./components/Types";
import { AppMenuToolbar } from "./menu/AppMenuToolbar";
import { AppMenu } from "./menu/AppMenu";

type AppProps = CommonProps;
const osType = type();
const mobile = osType === "ios" || osType === "android";

/**
 * Renders the main application component.
 *
 * @return {JSX.Element} The rendered application component.
 */
const App = ({ className }: AppProps) => {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");
    const [aboutPopupVisible, setAboutPopupVisible] = React.useState(false);
    const [preferencesVisible, setPreferencesVisible] = React.useState(false);
    const [settings, settingsLoaded, updateSettings, reloadSettings] = useSettings();
    const [drawerVisible, setDrawerVisible] = React.useState(false);
    const { token } = useAntdToken();
    const { setStateSaverEnabled, restoreState } = useWindowStateSaver(10_000);
    const { setTheme, updateBackround } = useAntdTheme();
    const [previewDarkMode, setPreviewDarkMode] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        if (settingsLoaded && settings !== null) {
            setStateSaverEnabled(settings.save_window_state);
            void restoreState();
        }
    }, [restoreState, settingsLoaded, settings, setStateSaverEnabled]);

    const { translate, setLocale } = useTranslate();

    React.useEffect(() => {
        if (settings && setTheme) {
            void setLocale(settings.locale);
            setTheme(settings.dark_mode ? "dark" : "light");
        }
    }, [setLocale, setTheme, settings]);

    const greet = React.useCallback(async () => {
        // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
        if (name.trim().length > 0) {
            setGreetMsg(await invoke("greet", { name }));
        }
    }, [name]);

    React.useEffect(() => {
        void greet();
    }, [greet]);

    const onClose = React.useCallback(() => {
        return false;
    }, []);

    const aboutPopupClose = React.useCallback(() => {
        setAboutPopupVisible(false);
    }, []);

    const onFinish = React.useCallback(async (e: { greetName: string }) => {
        setName(e.greetName);
    }, []);

    const menuItems = React.useMemo(() => {
        return appMenuItems(translate);
    }, [translate]);

    // Hide the Ant Design drawer header
    React.useEffect(() => {
        if (drawerVisible) {
            const menuDrawer = document.querySelector(".ant-drawer-header");

            if (menuDrawer && menuDrawer instanceof HTMLElement) {
                menuDrawer.style.display = "none";
            }
        }
    }, [drawerVisible]);

    const onMenuItemClick = React.useCallback((key: unknown) => {
        const keyValue = key as MenuKeys;
        switch (keyValue) {
            case "exitMenu": {
                void exit(0);
                break;
            }
            case "aboutMenu": {
                setAboutPopupVisible(true);
                break;
            }
            case "preferencesMenu": {
                setPreferencesVisible(true);
                break;
            }
            case "menuDrawer": {
                setDrawerVisible(f => !f);
                break;
            }
            default: {
                break;
            }
        }
    }, []);

    const onPreferencesClose = React.useCallback(() => {
        setPreferencesVisible(false);
        void reloadSettings().then(() => {
            setPreviewDarkMode(null);
            setTheme?.(settings?.dark_mode ? "dark" : "light");
        });
    }, [reloadSettings, setTheme, settings?.dark_mode]);

    // This effect occurs when the theme token has been changed and updates the
    // root and body element colors to match to the new theme.
    React.useEffect(() => {
        updateBackround?.(token);
    }, [token, updateBackround]);

    const toggleDarkMode = React.useCallback(
        (antdTheme: "light" | "dark") => {
            setTheme?.(antdTheme);
            setPreviewDarkMode(antdTheme === "dark");
        },
        [setTheme]
    );

    // Close the drawer when the user clicks outside of it
    const onCloseDrawer = React.useCallback(() => {
        setDrawerVisible(false);
    }, []);

    if (!settingsLoaded || settings === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {!mobile && (
                <StyledTitle //
                    title="TauriTemplate"
                    onClose={onClose}
                    darkMode={previewDarkMode ?? settings.dark_mode ?? false}
                    maximizeTitle={translate("maximize")}
                    minimizeTitle={translate("minimize")}
                    closeTitle={translate("close")}
                />
            )}
            <AppMenuToolbar //
                mobile={mobile}
                menuItems={menuItems}
                onItemClick={onMenuItemClick}
                darkMode={previewDarkMode ?? settings.dark_mode ?? false}
            />
            <div //
                className={classNames(App.name, className)}
            >
                <h1>Welcome to Tauri!</h1>

                <div className="row">
                    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
                        <img src="/vite.svg" className="logo vite" alt="Vite logo" />
                    </a>
                    <a href="https://tauri.app" target="_blank" rel="noreferrer">
                        <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
                    </a>
                    <a href="https://reactjs.org" target="_blank" rel="noreferrer">
                        <img src={reactLogo} className="logo react" alt="React logo" />
                    </a>
                </div>

                <div className="row">
                    <p>Click on the Tauri, Vite, and React logos to learn more.</p>
                </div>

                <Form className="row" onFinish={onFinish}>
                    <Form.Item
                        name="greetName"
                        rules={[
                            {
                                required: true,
                                message: translate("enterNameHolder"),
                            },
                        ]}
                    >
                        <Input id="greet-input" />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

                <div className="row">
                    <p>{greetMsg}</p>
                </div>
            </div>
            <AboutPopup //
                visible={aboutPopupVisible}
                onClose={aboutPopupClose}
                textColor="white"
            />
            {updateSettings && (
                <PreferencesPopup //
                    visible={preferencesVisible}
                    onClose={onPreferencesClose}
                    updateSettings={updateSettings}
                    settings={settings}
                    translate={translate}
                    toggleDarkMode={toggleDarkMode}
                />
            )}
            <Drawer //
                onClose={onCloseDrawer}
                open={drawerVisible}
                width="70%"
            >
                <AppMenu //
                    className="AppMenu"
                    mode="inline"
                    items={menuItems}
                    onItemClick={onMenuItemClick}
                    darkMode={true}
                />
            </Drawer>
        </>
    );
};

const SyledApp = styled(App)`
    height: 100%;
    width: 100%;
    display: contents;
    .AppMenu {
        overflow: hidden;
    }
`;

export { SyledApp as App };
