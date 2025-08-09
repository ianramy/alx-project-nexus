// src/interfaces/leaderboard.ts

import {User} from "@/interfaces/user"
import {Challenge} from "@/interfaces/challenge"


export interface Leaderboard {
    id: number;
    user: User;
    challenge: Challenge;
    score: number;
}
