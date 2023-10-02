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
        >
            <template v-if="isMoving">
                <img
                    src="../../assets/arrow-sm-up.svg"
                    class="direction-arrow"
                    :style="{
                        transform: `rotateZ(${rotateByDirection}deg)`,
                    }"
                />
                <div class="floor-indicator">{{ nextFloor! + 1 }}</div>
            </template>
        </div>
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
        elevatorSpeed: { type: Number, required: true },
        elevatorReload: { type: Number, required: true },
    },
    data() {
        return {
            curFloor: 0,
            reload: "",
            travelDuration: 0,
            translate: 0,
            isMoving: false,
            movingDirection: "",
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
            if (this.curFloor === undefined || this.nextFloor === undefined) {
                throw new Error("invalid floor data");
            }

            if (this.curFloor === this.nextFloor) {
                return;
            }

            this.$emit("elevatorMove", true);
            this.$emit("elevatorFree", false);
            this.isMoving = true;
            (this.movingDirection =
                this.nextFloor > this.curFloor ? "up" : "down"),
                (this.travelDuration = this.calcTravelDuration());
            this.translate = this.calcTranslate();

            setTimeout(() => {
                if (this.nextFloor !== undefined) {
                    this.curFloor = this.nextFloor;
                    this.reload = "reloading";
                    this.$emit("elevatorMove", false);
                    this.isMoving = false;
                }
                setTimeout(() => {
                    this.$emit("elevatorFree", true);
                    this.reload = "";
                }, this.elevatorReload);
            }, this.calcTravelDuration() * this.elevatorSpeed);
        },
    },
    computed: {
        rotateByDirection() {
            return this.movingDirection === "down" ? 180 : 0;
        },
    },
    watch: {
        nextFloor() {
            this.moveToFloor();
        },
    },
    mounted() {
        this.curFloor = this.nextFloor || 0;
        this.translate = this.calcTranslate();
        setTimeout(() => {
            this.$emit("elevatorFree", true);
        }, 0);
    },
});
</script>

<style>
.mine {
    height: 100%;
    width: 150px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
}
.elevator {
    background-image: url(../../assets/elevator.svg);
    background-repeat: no-repeat;
    background-size: contain;
    width: 150px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}
.reloading {
    animation: reload 1s ease infinite;
}
.direction-arrow {
    width: 50px;
    position: relative;
}
.floor-indicator {
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 50px;
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
