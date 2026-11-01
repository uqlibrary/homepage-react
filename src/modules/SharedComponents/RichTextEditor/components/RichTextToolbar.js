import React from 'react';
import {
    MenuControlsContainer,
    MenuSelectHeading,
    MenuButtonBold,
    MenuButtonItalic,
    MenuButtonBulletedList,
    MenuButtonOrderedList,
    MenuButtonEditLink,
    MenuButtonUndo,
    MenuButtonRedo,
    MenuDivider,
} from 'mui-tiptap';

const RichTextToolbar = () => {
    return (
        <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
            <MenuButtonEditLink />
            <MenuDivider />
            <MenuButtonBulletedList />
            <MenuButtonOrderedList />
            <MenuDivider />
            <MenuButtonUndo />
            <MenuButtonRedo />
        </MenuControlsContainer>
    );
};

export default RichTextToolbar;
