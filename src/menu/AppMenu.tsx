import * as React from "react";
import { Menu, type MenuProps } from "antd";
import type { MenuInfo, MenuMode } from "rc-menu/lib/interface";
import { styled } from "styled-components";
import classNames from "classnames";
import type { ItemType } from "antd/es/menu/interface";
import type { CommonProps } from "../components/Types";
import { darkModeMenuBackground, lightModeMenuBackground } from "../utilities/app/AntdConstants";
import type { MenuKeys } from "./MenuItems";

export type MenuItems = ItemType[];

/**
 * The props for the {@link AppMenu} component.
 */
export type AppMenuProps = {
    /** The menu items for the application menu. */
    items: MenuItems;
    /** The mode of the application menu. */
    mode?: MenuMode;
    /** A value indicating whether to use dark mode with the application. */
    darkMode: boolean;
    /**
     * Occurs then the menu item was clicked.
     * @param key The action key from the menu item.
     * @returns {void}
     */
    onItemClick: (key: MenuKeys) => void;
} & CommonProps;

/**
 * A component for the application menu for the PasswordKeeper.
 * @param param0 The component props {@link AppMenuProps}.
 * @returns A component.
 */
const AppMenu = ({
    items,
    className, //
    mode = "horizontal",
    onItemClick,
}: AppMenuProps) => {
    const onClick: MenuProps["onClick"] = React.useCallback(
        (e: MenuInfo) => {
            const key = e.key as MenuKeys;
            onItemClick(key);
        },
        [onItemClick]
    );

    return (
        <div className={classNames(AppMenu.name, className)}>
            <Menu //
                mode={mode}
                items={items}
                onClick={onClick}
            />
        </div>
    );
};

const StyledAppMenu = styled(AppMenu)`
    display: flex;
    flex-direction: column;
    min-height: 0px;
    padding-bottom: 10px;
    background-color: ${props => (props.darkMode ? darkModeMenuBackground : lightModeMenuBackground)};
`;

export { StyledAppMenu as AppMenu };
