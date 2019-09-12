import PeopleClient, { PersonDetails } from '../http/apiClients/PeopleClient';
import ApiClients from '../http/apiClients';
import PeopleResourceCollection from '../http/resourceCollections/PeopleResourceCollection';
import ResourceCollections from '../http/resourceCollections';
import { useFusionContext } from './FusionContext';
import * as React from 'react';

interface IPersonImage {
    [personId: string]: HTMLImageElement;
}

interface IPersonDetails {
    [personId: string]: PersonDetails;
}

export default class PeopleContainer {
    private peopleClient: PeopleClient;
    private resourceCollection: PeopleResourceCollection;

    private persons: IPersonDetails = {};
    private images: IPersonImage = {};

    constructor(apiClients: ApiClients, resourceCollections: ResourceCollections) {
        this.peopleClient = apiClients.people;
        this.resourceCollection = resourceCollections.people;
    }

    getPersonDetails(personId: string): PersonDetails | null {
        if (this.persons[personId]) {
            return this.persons[personId];
        }

        return null;
    }

    async getPersonDetailsAsync(personId: string): Promise<PersonDetails> {
        const cachedPerson = this.persons[personId];

        if (cachedPerson) {
            return cachedPerson;
        }

        const response = await this.peopleClient.getPersonDetailsAsync(personId, [
            'positions',
            'contracts',
            'roles',
        ]);

        this.persons[personId] = response.data;

        return this.persons[personId];
    }

    getPersonImage(personId: string): HTMLImageElement | null {
        if (this.images[personId]) {
            return this.images[personId];
        }

        return null;
    }

    async getPersonImageAsync(personId: string): Promise<HTMLImageElement> {
        const cachedImage = this.images[personId];

        if (cachedImage) {
            return cachedImage;
        }

        return new Promise((resolve, reject) => {
            const urlToImage = this.resourceCollection.getPersonPhoto(personId);
            const image = new Image();
            image.src = urlToImage;

            this.images[personId] = image;
            image.onerror = () => reject(`Could not load image ${urlToImage}.`);
            image.onload = () => resolve(image);
        });
    }
}

const usePeopleContainer = () => {
    const { peopleContainer } = useFusionContext();
    return peopleContainer;
};

const usePersonDetails = (personId: string) => {
    const peopleContainer = usePeopleContainer();

    const [isFetching, setFetching] = React.useState<boolean>(false);
    const [error, setError] = React.useState(null);
    const [personDetails, setPersonDetails] = React.useState<PersonDetails | null>(
        peopleContainer.getPersonDetails(personId)
    );

    const getPersonAsync = async (personId: string) => {
        try {
            setFetching(true);

            const personDetails = await peopleContainer.getPersonDetailsAsync(personId);

            setPersonDetails(personDetails);
            setFetching(false);
        } catch (error) {
            setError(error);
            setPersonDetails(null);
            setFetching(false);
        }
    };

    React.useEffect(() => {
        getPersonAsync(personId);
    }, [personId]);

    return { isFetching, error, personDetails };
};

const usePersonImageUrl = (personId: string) => {
    const peopleContainer = usePeopleContainer();

    const getCachedPersonImageUrl = React.useCallback((personId: string) => {
        const personImage = peopleContainer.getPersonImage(personId);

        if (personImage) {
            return personImage.src;
        }

        return '';
    }, []);

    const [isFetching, setFetching] = React.useState<boolean>(false);
    const [error, setError] = React.useState(null);
    const [imageUrl, setImageUrl] = React.useState<string>(getCachedPersonImageUrl(personId));

    const getImageAsync = async (personId: string) => {
        const cachedImageUrl = getCachedPersonImageUrl(personId);

        if (cachedImageUrl !== '') {
            return cachedImageUrl;
        }

        try {
            setFetching(true);

            const image = await peopleContainer.getPersonImageAsync(personId);

            setImageUrl(image.src);
            setFetching(false);
        } catch (error) {
            setFetching(false);
            setError(error);
            setImageUrl('');
        }
    };

    React.useEffect(() => {
        getImageAsync(personId);
    }, [personId]);

    return { isFetching, error, imageUrl };
};

export { usePeopleContainer, usePersonDetails, usePersonImageUrl };
