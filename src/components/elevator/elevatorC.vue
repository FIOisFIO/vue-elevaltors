<template>
    <div class="mine">
        <div
            class="elevator"
            :style="{
                transform: 'translateY(' + calcTranslate() + 'px)',
                height: floorHeignt + 'px',
                transitionDuration:
                    Math.abs(nextFloor || curFloor - curFloor) + 's',
            }"
            @click="console.log(queue)"
        ></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "App",
    components: {},
    props: {
        floorHeignt: Number,
        id: Number,
        queue: Array,
        nextFloor: Number,
    },
    data() {
        return {
            curFloor: 1,
        };
    },
    methods: {
        calcTranslate(): number {
            if (this.nextFloor) {
                return (this.nextFloor - 1) * -(this.floorHeignt || 0);
            } else {
                return (this.curFloor - 1) * -(this.floorHeignt || 0);
            }
        },
    },
    watch: {
        queue: {
            handler(newValue) {
                for (let i = 0; i < newValue.length; i++) {
                    console.log(this.queue);
                }
            },
            deep: true,
        },
    },
});
</script>

<style>
.mine {
    height: 100%;
    width: 50px;
    display: flex;
    align-items: flex-end;
}

.elevator {
    background-color: blueviolet;
    border: 1px solid black;
    width: 30px;
    box-sizing: border-box;
}
</style>
