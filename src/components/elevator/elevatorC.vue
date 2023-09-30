<template>
    <div class="mine">
        <div
            class="elevator"
            :style="{
                transitionDuration: travelDuration + 's',
                transform: 'translateY(' + translate + 'px)',
                height: floorHeignt + 'px',
            }"
            :class="reload"
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
            curFloor: 0,
            reload: "",
            travelDuration: 0,
            translate: 0,
        };
    },
    methods: {
        calcTranslate(): number {
            if (this.nextFloor !== undefined) {
                return this.nextFloor * -(this.floorHeignt || 0);
            } else {
                return this.curFloor * -(this.floorHeignt || 0);
            }
        },
        calcTravelDuration() {
            return this.nextFloor !== undefined
                ? Math.abs(this.nextFloor - this.curFloor)
                : 0;
        },
        moveToFloor() {
            this.$emit("elevatorMove", true);
            this.$emit("elevatorFree", false);
            this.travelDuration = this.calcTravelDuration();
            this.translate = this.calcTranslate();

            setTimeout(() => {
                if (this.nextFloor !== undefined) {
                    this.curFloor = this.nextFloor;
                    this.reload = "reloading";
                    this.$emit("elevatorMove", false);
                }
                setTimeout(() => {
                    this.$emit("elevatorFree", true);
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
