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

export type PersonPresenceActivity =
    | 'Available'
    | 'Away'
    | 'BeRightBack'
    | 'Busy'
    | 'DoNotDisturb'
    | 'InACall'
    | 'InAConferenceCall'
    | 'Inactive'
    | 'InAMeeting'
    | 'Offline'
    | 'OffWork'
    | 'OutOfOffice'
    | 'PresenceUnknown'
    | 'Presenting'
    | 'UrgentInterruptionsOnly';

type PersonPresence = {
    id: string;
    availability: PersonPresenceAvailability;
    activity: PersonPresenceActivity;
};

export default PersonPresence;
