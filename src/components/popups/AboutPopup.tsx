/*
MIT License

Copyright (c) 2024 Petteri Kautonen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import * as React from "react";
import classNames from "classnames";
import { getName, getVersion } from "@tauri-apps/api/app";
import { styled } from "styled-components";
import { open } from "@tauri-apps/plugin-shell";
import { Button, Modal, Tooltip } from "antd";
import { ReloadOutlined, DownloadOutlined } from "@ant-design/icons";
import { CommonProps } from "../Types";
import { useTranslate } from "../../localization/Localization";
import { useNotify } from "../../utilities/app/Notify";
import { GithubLogo, LogoImage } from "../../utilities/app/Images";
import { useTauriUpdater } from "../../hooks/UseTauriUpdater";

/**
 * The props for the {@link AboutPopup} component.
 */
type AboutPopupProps = {
    /** A value indicating whether this popup is visible. */
    visible: boolean;
    /** Occurs when the popup has been closed. */
    onClose: () => void;
    /** A  text color for highlighted text. */
    textColor: string;
} & CommonProps;

const AboutPopup = ({
    className, //
    visible,
    onClose,
}: AboutPopupProps) => {
    const { translate } = useTranslate();
    const [contextHolder, notification] = useNotify();

    const [appVersion, setAppVersion] = React.useState("");
    const [appName, setAppName] = React.useState("");

    const [shouldUpdate, manifest, reCheck, update, error, errorMessage] = useTauriUpdater(!visible);

    // Get the application name and current version.
    React.useEffect(() => {
        const versionPromise = getVersion();
        const appNamePromise = getName();
        void Promise.all([versionPromise, appNamePromise]).then(([v, n]) => {
            setAppName(n);
            setAppVersion(v);
        });
    }, []);

    // Open the https://tauri.app URL when the corresponding component is clicked.
    const openAppUrl = React.useCallback(() => {
        void open("https://tauri.app");
    }, []);

    // Open the github.com URL when the corresponding component is clicked.
    const openGitHubUrl = React.useCallback(() => {
        void open("https://github.com/VPKSoftOrg/tauri_react_vite_ts_script");
    }, []);

    // Open the latest release from the github.com.
    const manualDownloadClick = React.useCallback(() => {
        void open("https://github.com/VPKSoftOrg/tauri_react_vite_ts_script/releases/latest");
    }, []);

    React.useEffect(() => {
        if (error) {
            notification("error", errorMessage, 5);
        }
    }, [error, errorMessage, notification]);

    return (
        <Modal //
            title={translate("about")}
            onOk={onClose}
            open={visible}
            width={700}
            footer={null}
            onCancel={onClose}
            centered
        >
            {contextHolder}
            <div className={classNames(AboutPopup.name, className)}>
                <div className="Popup-versionText">{`${appName}, ${translate("copyright")} © 2024 VPKSoft, v.${appVersion}`}</div>
                <div className="Popup-licenseText">{translate("license")}</div>
                <div className="Popup-licenseContent">
                    {`MIT License

Copyright (c) 2024 #COPYRIGHT#

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE."
                `}
                </div>
                <div className="LogoImages">
                    <img src={LogoImage} className="LogoImage" onClick={openAppUrl} />

                    <img src={GithubLogo} className="LogoImage" onClick={openGitHubUrl} />
                </div>
                <div
                    className="Popup-UpdateNotify" //
                >
                    {shouldUpdate ? (
                        <div className={classNames("Popup-UpdateNotify-text", "Popup-UpdateNotify-text-updates")}>{translate("newVersionAvailable")}</div>
                    ) : (
                        <div className="Popup-UpdateNotify-text">{translate("versionUpToDate")}</div>
                    )}

                    <div className="Popup-UpdateNotify-text">{`v.${manifest?.version ?? appVersion}`}</div>
                    <div>
                        <Tooltip title={translate("buttonRefresh")}>
                            <Button className="Popup-UpdateNotify-button" icon={<ReloadOutlined />} onClick={reCheck}></Button>
                        </Tooltip>
                        <Tooltip title={translate("updateButton")}>
                            <Button className="Popup-UpdateNotify-button" icon={<DownloadOutlined />} onClick={update} disabled={!shouldUpdate}></Button>
                        </Tooltip>
                        <Button className="Popup-UpdateNotify-button" onClick={manualDownloadClick}>
                            {translate("manualDownload")}
                        </Button>
                    </div>
                </div>
                {error && <div className="VersionCheckError-text">{errorMessage}</div>}
                <div className="Popup-ButtonRow">
                    <Button //
                        onClick={onClose}
                    >
                        {translate("ok")}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

const StyledAboutPopup = styled(AboutPopup)`
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 500px;
    .Popup-versionText {
        font-weight: bolder;
        margin-bottom: 10px;
    }
    .Popup-licenseText {
        font-weight: bolder;
        margin-bottom: 10px;
    }
    .Popup-licenseContent {
        white-space: pre-wrap;
        overflow: auto;
        font-family: monospace;
    }
    .Popup-UpdateNotify {
        justify-content: space-between;
        display: flex;
        width: 100%;
        flex-direction: row;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .Popup-UpdateNotify-text {
        align-content: center;
        display: flex;
        flex-wrap: wrap;
        margin-right: 10px;
    }
    .VersionCheckError-text {
        align-content: center;
        display: flex;
        flex-wrap: wrap;
        margin-right: 10px;
        font-weight: bold;
        color: red;
    }
    .Popup-UpdateNotify-button {
        margin-right: 4px;
    }
    .Popup-UpdateNotify-text-updates {
        color: ${p => p.textColor};
    }
    .Popup-ButtonRow {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: flex-end;
    }
    .LogoImages {
        display: flex;
        flex-direction: row;
        height: 100px;
        justify-content: space-evenly;
    }
    .LogoImage {
        height: 90%;
        // margin-left: 25%;
        margin-top: 10px;
        cursor: pointer;
    }
`;

export { StyledAboutPopup as AboutPopup };
