/// Employee has a corporate mail address and is identified by user having membership in the F.[Company] AD group.
/// Consultants has a corporate mail address and membership in the K.[Company] AD group.
/// External users has a GUEST account in azure ad, AKA affiliate access account.
/// Local users only exists in the fusion database. - These users can not log in.

type PersonAccountType = 'consultant' | 'employee' | 'external' | 'local';

export default PersonAccountType;
