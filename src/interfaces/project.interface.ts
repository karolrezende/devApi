
interface Tproject {
    id: number,
    name:  string
    description:  string
    estimatedTime:  string
    repository:  string
    startDate:  Date, 
    endDate:  Date, 
    developerId:  number
}

type TprojectRequest = Omit <Tproject, "id">

interface TpatchProject {
    id: number,
    name?:  string
    description?:  string
    estimatedTime?:  string
    repository?:  string
    startDate?:  Date, 
    endDate?: Date, 
    developerId?:  number
}

type TpatchProjectRequest = Omit <TpatchProject, "id">

export {Tproject, TprojectRequest, TpatchProject, TpatchProjectRequest}