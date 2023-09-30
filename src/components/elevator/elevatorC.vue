<template>
    <div class="mine">
        <div
            class="elevator"
            :style="{
                transform: 'translateY(' + calcTranslate() + 'px)',
                height: floorHeignt + 'px',
                transitionDuration: calcTravelDuration() + 's',
            }"
            :class="reload"
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
            reload: "",
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
        calcTravelDuration() {
            return Math.abs((this.nextFloor || this.curFloor) - this.curFloor);
        },
        moveToFloor() {
            this.$emit("elevatorMove", true);
            setTimeout(() => {
                if (this.nextFloor) {
                    this.curFloor = this.nextFloor;
                    this.reload = "reloading";
                }
                setTimeout(() => {
                    this.$emit("elevatorMove", false);
                    this.reload = "";
                }, 3000);
            }, this.calcTravelDuration() * 1000);
        },
    },
    watch: {
        nextFloor() {
            this.moveToFloor();
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
.reloading {
    animation: reload 1s ease infinite;
}
@keyframes reload {
    from {
        opacity: 0.6;
    }
    to {
        opacity: 1;
    }
}
</style>
