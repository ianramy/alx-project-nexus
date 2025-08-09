// src/interfaces/challenge.ts

import {User} from "@/interfaces/user"

export interface Challenge {
    id: number;
    title: string;
    description: string;
    reward: string;
    start_date: string;
    end_date: string;
    participants: User[];
}
