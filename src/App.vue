<template>
    <div class="main-wrp" :style="{ height: floorHeignt * floorsCount + 'px' }">
        <div class="elevators-wrp">
            <elevator-c
                v-for="(elevator, index) in elevators"
                :key="index"
                :id="index"
                :floorHeignt="floorHeignt"
                :nextFloor="elevators[index].nextFloor"
                :elevatorSpeed="elevatorSpeed"
                :elevatorReload="elevatorReload"
                @elevatorMove="(event) => onElevatorMove(event, index)"
                @elevatorFree="(event) => onElevatorFree(event, index)"
            ></elevator-c>
        </div>
        <div class="floors-wrp">
            <floor-c
                v-for="(floor, index) in floors"
                :key="index"
                :id="index"
                :floorHeignt="floorHeignt"
                :isCalled="floors[index]"
                @call="callElevator"
            >
            </floor-c>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import elevatorC from "./components/elevator/elevatorC.vue";
import floorC from "./components/floor/floorC.vue";
import { Elevator } from "./types";
import {
    getElevatorsState,
    saveElevatorsState,
    clearState,
} from "./helpers/localStorage.helper";
import { config } from "./config";

export default defineComponent({
    name: "App",
    components: { elevatorC, floorC },
    data() {
        return {
            floorsCount: config.floorsCount,
            elevatorsCount: config.elevatorsCount,
            floorHeignt: config.floorHeignt,
            elevatorSpeed: config.elevatorSpeed,
            elevatorReload: config.elevatorReload,
            queue: [] as number[],
            elevators: [] as Elevator[],
            floors: [] as boolean[],
        };
    },
    methods: {
        callElevator(floor: number) {
            if (!this.checkFloorCallable(floor)) {
                return;
            }

            this.queue.push(floor);
            this.floors[floor] = true;
            const freeElevator = this.findRelevantElevator(floor);

            if (this.queue.length === 1 && freeElevator) {
                this.launchElevator(freeElevator);

                return;
            }

            saveElevatorsState(this.queue, this.elevators);
        },
        checkFloorCallable(floor: number) {
            return (
                !this.queue.includes(floor) &&
                !this.getElevatorsPosition().includes(floor)
            );
        },
        findRelevantElevator(floor: number) {
            const freeElevators = this.getFreeElevators();

            return (
                freeElevators.reduce((acc, elevator) => {
                    if (
                        Math.abs(elevator.nextFloor - floor) <
                        Math.abs(acc.nextFloor - floor)
                    ) {
                        acc = elevator;
                    }
                    return acc;
                }, freeElevators[0]) || null
            );
        },
        launchElevator(elevator: Elevator) {
            const firstInQueue = this.queue.shift();

            if (firstInQueue !== undefined) {
                elevator.nextFloor = firstInQueue;
            }

            saveElevatorsState(this.queue, this.elevators);
        },
        onElevatorMove(e: boolean, index: number) {
            if (!e) {
                const elevator = this.elevators[index];
                this.floors[elevator.nextFloor] = false;
            }
        },
        onElevatorFree(e: boolean, index: number) {
            const elevator = this.elevators[index];

            elevator.isMoving = !e;

            if (e) {
                this.launchElevator(elevator);
            }
        },
        getFreeElevators() {
            return this.elevators.filter((elevator) => !elevator.isMoving);
        },

        getElevatorsPosition() {
            return this.elevators.map((elevator) => elevator.nextFloor);
        },
    },
    mounted() {
        let state = getElevatorsState();

        state =
            state && state.positions.length === this.elevatorsCount
                ? state
                : null;

        if (!state) clearState();

        this.elevators = [];

        for (let i = 0; i < this.elevatorsCount; i++) {
            this.elevators.push({
                isMoving: false,
                nextFloor: state?.positions[i] || 0,
            });
        }

        this.queue = state?.queue || [];
        this.floors = new Array(this.floorsCount)
            .fill(false)
            .map((floor, index) => !!state?.queue.includes(index));
    },
});
</script>

<style>
#app {
    font-family: Arial, Helvetica, sans-serif;
}
.main-wrp {
    display: flex;
}
.elevators-wrp {
    display: flex;
    height: 100%;
}
.floors-wrp {
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
}
</style>
