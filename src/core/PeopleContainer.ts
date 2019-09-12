import PeopleClient, { PersonDetails } from '../http/apiClients/PeopleClient';
import ApiClients from '../http/apiClients';
import PeopleResourceCollection from '../http/resourceCollections/PeopleResourceCollection';
import ResourceCollections from '../http/resourceCollections';
import { useFusionContext } from './FusionContext';

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

    async getPersonDetails(personId: string): Promise<PersonDetails> {
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

    async getPersonImage(personId: string): Promise<HTMLImageElement> {
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
    return peopleContainer.getPersonDetails(personId);
};

const usePersonImage = (personId?: string, person?: PersonDetails) => {
    const peopleContainer = usePeopleContainer();

    if (personId) {
        return peopleContainer.getPersonImage(personId);
    } else if (person) {
        return peopleContainer.getPersonImage(person.azureUniqueId);
    } else {
        throw new Error('You must specify at least one of personId or person');
    }
};

export { usePeopleContainer, usePersonDetails, usePersonImage };
