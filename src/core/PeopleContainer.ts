import PeopleClient, {
  PersonDetails,
  PersonRole
} from '../http/apiClients/PeopleClient';
import ApiClients from '../http/apiClients';
import PeopleResourceCollection from '../http/resourceCollections/PeopleResourceCollection';
import ResourceCollections from '../http/resourceCollections';
import { useFusionContext } from './FusionContext';
import * as React from 'react';
import EventEmitter, { useEventEmitter } from '../utils/EventEmitter';
import DistributedState, { IDistributedState } from '../utils/DistributedState';
import { IEventHub } from '../utils/EventHub';

interface IPersonImage {
  [personId: string]: IDistributedState<HTMLImageElement>;
}

interface IPersonDetails {
  [personId: string]: IDistributedState<PersonDetails>;
}

type PersonContainerEvents = {
  updated: (updatedPerson: PersonDetails) => void;
};

export default class PeopleContainer extends EventEmitter<
  PersonContainerEvents
> {
  private peopleClient: PeopleClient;
  private resourceCollection: PeopleResourceCollection;

  private persons: IPersonDetails = {};
  private images: IPersonImage = {};
  private eventHub: IEventHub;

  constructor(
    apiClients: ApiClients,
    resourceCollections: ResourceCollections,
    eventHub: IEventHub
  ) {
    super();
    this.peopleClient = apiClients.people;
    this.resourceCollection = resourceCollections.people;
    this.eventHub = eventHub;
  }

  getPersonDetails(personId: string): PersonDetails | null {
    if (this.persons[personId]) {
      return this.persons[personId].state;
    }

    return null;
  }

  async getPersonDetailsAsync(personId: string): Promise<PersonDetails> {
    const cachedPerson = this.persons[personId];

    if (cachedPerson) {
      return cachedPerson.state;
    }

    const response = await this.peopleClient.getPersonDetailsAsync(personId, [
      'positions',
      'contracts',
      'roles'
    ]);

    this.persons[personId] = new DistributedState<PersonDetails>(
      `PeopleContainer.person.${personId}`,
      response.data,
      this.eventHub
    );
    this.persons[personId].on('change', personDetails => {
      this.emit('updated', personDetails);
    });
    return this.persons[personId].state;
  }

  async setRoleStatusForUser(
    personId: string,
    roleName: string,
    isActive: boolean
  ): Promise<PersonRole> {
    const response = await this.peopleClient.setRoleStatusForUser(
      personId,
      roleName,
      isActive
    );

    if (!this.persons[personId] || !this.persons[personId].state.roles)
      return response.data;
    const person = this.persons[personId].state;

    const roles = person.roles;
    if (roles) {
      const newRoles = roles.map(role =>
        role.name === roleName ? response.data : role
      );
      this.persons[personId].state = { ...person, roles: newRoles };
    }

    return response.data;
  }

  getPersonImage(personId: string): HTMLImageElement | null {
    if (this.images[personId]) {
      return this.images[personId].state;
    }

    return null;
  }

  async getPersonImageAsync(personId: string): Promise<HTMLImageElement> {
    const cachedImage = this.images[personId];

    if (cachedImage) {
      return cachedImage.state;
    }

    return new Promise((resolve, reject) => {
      const urlToImage = this.resourceCollection.getPersonPhoto(personId);
      const image = new Image();
      image.src = urlToImage;

      image.onerror = () => reject(`Could not load image ${urlToImage}.`);
      image.onload = () => {
        this.images[personId].state = image;
        resolve(image);
      };
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
  const [
    personDetails,
    setPersonDetails
  ] = React.useState<PersonDetails | null>(
    peopleContainer.getPersonDetails(personId)
  );

  const getPersonAsync = async (personId: string) => {
    try {
      setFetching(true);

      const personDetails = await peopleContainer.getPersonDetailsAsync(
        personId
      );

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

  const updatedPersonHandler = React.useCallback(
    (updatedPerson: PersonDetails) => {
      if (personId === updatedPerson.azureUniqueId) {
        setPersonDetails(updatedPerson);
      }
    },
    [personId]
  );

  useEventEmitter(peopleContainer, 'updated', updatedPersonHandler);

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
  const [imageUrl, setImageUrl] = React.useState<string>(
    getCachedPersonImageUrl(personId)
  );

  const getImageAsync = async (personId: string) => {
    const cachedImageUrl = getCachedPersonImageUrl(personId);

    if (cachedImageUrl !== '') {
      setImageUrl(cachedImageUrl);
      return;
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
