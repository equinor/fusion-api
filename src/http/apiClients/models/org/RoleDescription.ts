import AssignedPerson from './AssignedPerson';


type RoleDescriptionContent = {
    lastUpdate: Date | null,
    lastUpdatedBy: AssignedPerson | null, 
    content: string | null,
    type: "Generic" | "Personal",
}

type RoleDescription = {
    generic: RoleDescriptionContent & {exists: boolean},
    persons: RoleDescriptionContent & {person: AssignedPerson}[]
}

export default RoleDescription;