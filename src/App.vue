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
            ></elevator-c>
        </div>
        <div class="floors-wrp">
            <floor-c
                v-for="floor in floorsCount"
                :key="floor"
                :id="floor"
                :floorHeignt="floorHeignt"
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
                    nextFloor: 1,
                },
            ],
        };
    },
    methods: {
        callElevator(floor: number) {
            if (this.checkFloorCallable(floor)) this.queue.push(floor);
            const freeElevator = this.findRelevantElevator(floor);
            if (this.queue.length === 1 && freeElevator) {
                this.launchElevator(freeElevator);
            }
        },
        onElevatorMove(e: boolean, index: number) {
            this.elevators[index].isMoving = e;
            if (!e && this.queue.length !== 0) {
                this.launchElevator(this.elevators[index]);
            }
        },
        launchElevator(elevator: any) {
            const firstInQueue = this.queue.shift();
            if (firstInQueue) elevator.nextFloor = firstInQueue;
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
        getFreeElevatorsPosition() {
            return this.getFreeElevators().map(
                (elevator) => elevator.nextFloor
            );
        },
        checkFloorCallable(floor: number) {
            return (
                !this.queue.includes(floor) &&
                !this.getFreeElevatorsPosition().includes(floor)
            );
        },
    },
    created() {
        this.elevators = [];
        for (let i = 0; i < this.elevatorsCount; i++) {
            this.elevators.push({
                isMoving: false,
                nextFloor: 1,
            });
        }
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
