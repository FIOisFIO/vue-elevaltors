<template>
    <div
        class="floor"
        :style="{
            height: floorHeignt + 'px',
        }"
    >
        <button
            @click="$emit('call', id)"
            class="callElevatorBtn"
            :class="activeClass"
        ></button>
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
        isCalled: Boolean,
    },
    data() {
        return {
            curFloor: 1,
            nextFloor: 1,
        };
    },
    computed: {
        activeClass() {
            return this.isCalled ? "active" : "";
        },
    },
});
</script>
<style>
.callElevatorBtn {
    background-color: blue;
}
.active {
    background-color: red;
}
</style>
