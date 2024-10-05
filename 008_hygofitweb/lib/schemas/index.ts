import { v1 } from "./v1";
import { v2 } from "./v2";
import { v3 } from "./v3";
import { v4 } from "./v4";

export const SCHEMAS = [v1, v2, v3, v4];

export const messageTemplate = `Please create a json list of exercise groups.
The exercise group should have a difficultyRating difficulty level.
Study workouts tagged with athlete and create a workout a inspired by the style of athlete. 
Please take into account set structures like Pyramid Set, Reverse Pyramid Set, Drop Set, Super Slow Set, Cluster Set, Rest-Pause Set, 21s (Partial Reps), Straight Set, Superset, Giant Set.
Make sure the sum of durationMinutes for all exercises adds up to DURATION minutes.
The workout should target the following muscle groups: muscleGroups.`;
