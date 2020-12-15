export type PersonPresenceAvailability =
    | 'Offline'
    | 'Online'
    | 'None'
    | 'IdleBusy'
    | 'DoNotDisturb'
    | 'BeRightBack';

type PersonPresence = {
    id: string;
    availability: PersonPresenceAvailability;
    activity: string | null;
};

export default PersonPresence;
