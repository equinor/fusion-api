import EventEmitter from '../utils/EventEmitter';
import { useFusionContext } from './FusionContext';
import { useEffect } from 'react';
import { IEventHub } from '../utils/EventHub';
import { IDistributedState } from '../utils/DistributedState';
import DistributedState from '../utils/DistributedState';
import { PersonDetails } from '../http/apiClients/PeopleClient';

export type UserMenuComponentProps = {
    personDetails?: PersonDetails
}

export type UserMenuSectionItem = {
    key: string;
    title: string | React.ReactNode;
    aside?: string | React.ReactNode;
    isSelected?: boolean;
    isDisabled?: boolean;
    onClick?: (item: UserMenuSectionItem) => void;
    component?: React.FC<UserMenuComponentProps>;
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
    private readonly _sections: IDistributedState<UserMenuSection[]>;

    constructor(eventHub: IEventHub) {
        super();
        this._sections = new DistributedState<UserMenuSection[]>('userMenuSections', [], eventHub);
        this._sections.on('change', (sections: UserMenuSection[]) => {
            this.emit('change', sections);
        });
    }

    get sections() {
        return [...this._sections.state];
    }

    registerSection(section: UserMenuSection) {
        this._sections.state = [...this.sections, section];
        this.emit('change', this.sections);

        return () => this.unregisterSection(section);
    }

    private unregisterSection(section: UserMenuSection) {
        this._sections.state = this.sections.filter(s => s.key !== section.key);
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
