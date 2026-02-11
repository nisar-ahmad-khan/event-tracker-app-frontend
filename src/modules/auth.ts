
export interface RegisterPayload {
    name: string,
    email: string,
    password: string
}

export type User = {
    id: string | number,
    name: string,
    email: string
}

export interface RegisterResponse{
    user: User,
    token?: string
}