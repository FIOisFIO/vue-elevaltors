import { Elevator } from "@/types";
import { ElevatorsState } from "./types";

export function saveElevatorsState(queue: number[], elevators: Elevator[]) {
    const state = {
        queue,
        positions: elevators.map((elevator) => elevator.nextFloor),
    };
    localStorage.setItem("elevatorsState", JSON.stringify(state));
}
export function getElevatorsState(): ElevatorsState | null {
    return JSON.parse(localStorage.getItem("elevatorsState") || "null");
}
export function clearState() {
    localStorage.removeItem("elevatorsState");
}
