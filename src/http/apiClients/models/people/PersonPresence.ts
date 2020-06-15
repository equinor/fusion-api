export type PersonPresenceAvailability =
    | 'Offline'
    | 'Online'
    | 'None'
    | 'IdleBusy'
    | 'DoNotDisturb'
    | 'BeRightBack';

type PersonPresence = {
    mail: string | null;
    availability: PersonPresenceAvailability;
    activity: string | null;
    deviceType: string;
};

export default PersonPresence;