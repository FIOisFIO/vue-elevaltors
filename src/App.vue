<template>
    <div class="main-wrp">
        <div class="elevators-wrp">
            <elevator-c
                v-for="(elevator, index) in elevators"
                :key="index"
                :id="index"
                :floorHeignt="floorHeignt"
                :nextFloor="elevators[index].nextFloor"
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

export default defineComponent({
    name: "App",
    components: { elevatorC, floorC },
    data() {
        return {
            floorsCount: 5,
            elevatorsCount: 2,
            floorHeignt: 50,
            queue: [] as number[],
            elevators: [
                {
                    isMoving: false,
                    nextFloor: 0,
                },
            ],
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
            }
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
        launchElevator(elevator: any) {
            const firstInQueue = this.queue.shift();
            if (firstInQueue !== undefined) elevator.nextFloor = firstInQueue;
        },
        getFreeElevators() {
            return this.elevators.filter((elevator) => !elevator.isMoving);
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
        getElevatorsPosition() {
            return this.elevators.map((elevator) => elevator.nextFloor);
        },
        checkFloorCallable(floor: number) {
            return (
                !this.queue.includes(floor) &&
                !this.getElevatorsPosition().includes(floor)
            );
        },
    },
    created() {
        this.elevators = [];
        for (let i = 0; i < this.elevatorsCount; i++) {
            this.elevators.push({
                isMoving: false,
                nextFloor: 0,
            });
        }
        this.floors = new Array(this.floorsCount).fill(false);
    },
});
</script>

<style>
.main-wrp {
    display: flex;
    height: 300px;
}
.elevators-wrp {
    display: flex;
    height: 100%;
}
.floors-wrp {
    display: flex;
    flex-direction: column-reverse;
}
</style>
