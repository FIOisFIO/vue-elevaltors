<template>
    <div class="main-wrp">
        <div class="elevators-wrp">
            <elevator-c
                v-for="(elevator, index) in elevators"
                :key="index"
                :id="index"
                :floorHeignt="floorHeignt"
                :nextFloor="elevators[index].nextFloor"
            ></elevator-c>
        </div>
        <div class="floors-wrp">
            <floor-c
                v-for="floor in floorsCount"
                :key="floor"
                :id="floor"
                :floorHeignt="floorHeignt"
                @call="callElevator(floor)"
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
            this.queue.push(floor);
            this.elevators[0].nextFloor = floor;
            console.log(this.elevators);
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
