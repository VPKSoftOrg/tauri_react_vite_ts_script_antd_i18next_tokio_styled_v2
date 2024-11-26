import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faDoorOpen, faGear, faInfo } from "@fortawesome/free-solid-svg-icons";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type { LocalizeFunction } from "../localization/Localization";
import type { ToolBarItem, ToolBarSeparator } from "./AppToolbar";
import type { MenuKeys } from "./MenuItems";

export const appToolbarItems = (mobile: boolean, localize?: LocalizeFunction): (ToolBarItem<MenuKeys> | ToolBarSeparator)[] => {
    const result: (ToolBarItem<MenuKeys> | ToolBarSeparator)[] = [];

    // Only add menu button if on mobile
    if (mobile) {
        result.push({
            icon: <FontAwesomeIcon icon={faBars as IconProp} />,
            title: localize?.("menu") ?? "Menu",
            tooltipTitle: localize?.("menu") ?? "Menu",
            clickActionObject: "menuDrawer",
        });
    }

    result.push(
        {
            icon: <FontAwesomeIcon icon={faGear as IconProp} />,
            title: localize?.("preferences") ?? "Preferences",
            tooltipTitle: localize?.("preferences") ?? "Preferences",
            clickActionObject: "preferencesMenu",
        },
        {
            icon: <FontAwesomeIcon icon={faDoorOpen as IconProp} />,
            title: localize?.("exitMenu") ?? "Exit",
            tooltipTitle: localize?.("exitMenu") ?? "Exit",
            clickActionObject: "exitMenu",
        },
        "|",
        {
            icon: <FontAwesomeIcon icon={faInfo as IconProp} />,
            title: localize?.("aboutMenu") ?? "About",
            tooltipTitle: localize?.("aboutMenu") ?? "About",
            clickActionObject: "aboutMenu",
        }
    );

    return result;
};
