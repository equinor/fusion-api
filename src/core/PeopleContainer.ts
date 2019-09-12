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

    async getPersonImageAsync(personId: string): Promise<HTMLImageElement> {
        const cachedImage = this.images[personId];

        if (cachedImage) {
            return cachedImage;
        }

        const urlToImage = this.resourceCollection.getPersonPhoto(personId);
        const image = new Image();
        image.src = urlToImage;

        this.images[personId] = image;

        return image;
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
    const [personDetails, setPersonDetails] = React.useState<PersonDetails | null>();

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

    const [isFetching, setFetching] = React.useState<boolean>(false);
    const [error, setError] = React.useState(null);
    const [imageUrl, setImageUrl] = React.useState<string>('');

    const getImageAsync = async (personId: string) => {
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
