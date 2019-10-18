import EventEmitter from '../utils/EventEmitter';
import { useFusionContext } from './FusionContext';
import { useEffect } from 'react';

export type UserMenuSectionItem = {
    key: string;
    title: string | React.ReactNode;
    aside?: string | React.ReactNode;
    isSelected?: boolean;
    isDisabled?: boolean;
    onClick?: (item: UserMenuSectionItem) => void;
};

export type UserMenuSection = {
    key: string;
    title?: string;
    items: UserMenuSectionItem[];
};

type SectionEvents = {
    change: (sections: UserMenuSection[]) => void;
};

export default class UserMenuContainer extends EventEmitter<SectionEvents> {
    private _sections: UserMenuSection[] = [];

    get sections() {
        return [...this._sections];
    }

    registerSection(section: UserMenuSection) {
        this._sections = [...this.sections, section];
        this.emit('change', this.sections);

        return () => this.unregisterSection(section);
    }

    private unregisterSection(section: UserMenuSection) {
        this._sections = this.sections.filter(s => s.key !== section.key);
        this.emit('change', this.sections);
    }
}

export const useCustomUserMenuSection = (section: UserMenuSection) => {
    const { userMenuSectionsContainer } = useFusionContext();
    useEffect(() => {
        const unregister = userMenuSectionsContainer.registerSection(section);
        return () => unregister();
    }, [section]);
};
