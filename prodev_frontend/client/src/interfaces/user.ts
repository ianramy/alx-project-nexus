// src/interfaces/user.ts

import {City} from "@/interfaces/location"


export interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    city?: City;
}
