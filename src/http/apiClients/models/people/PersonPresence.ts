export type PersonPresenceAvailability =
    | 'Away'
    | 'Available'
    | 'AvailableIdle'
    | 'BeRightBack'
    | 'Busy'
    | 'BusyIdle'
    | 'DoNotDisturb'
    | 'Offline'
    | 'PresenceUnknown';

type PersonPresence = {
    mail: string | null;
    availability: PersonPresenceAvailability;
    activity: string;
};

export default PersonPresence;
