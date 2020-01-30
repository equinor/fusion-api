import AssignedPerson from './AssignedPerson';


type RoleDescriptionContent = {
    lastUpdated: Date | null,
    lastUpdatedBy: AssignedPerson | null, 
    content: string | null,
    type: "Generic" | "Personal",
}

type RoleDescription = {
    generic: RoleDescriptionContent & {exists: boolean},
    persons: Array<RoleDescriptionContent & {person: AssignedPerson}>
}

export default RoleDescription;