<template>
    <button class="callElevatorBtn">
        {{ floor! + 1 }}
    </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "App",
    components: {},
    props: {
        floor: Number,
    },
});
</script>
<style>
.callElevatorBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 5px solid #000000;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 40px;
}
</style>
