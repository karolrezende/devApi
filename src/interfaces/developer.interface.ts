interface Tdeveloper {
    id: number,
    name: string,
    email: string
}

type TdeveloperRequest = Omit<Tdeveloper, "id">

export {Tdeveloper, TdeveloperRequest}