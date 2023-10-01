<template>
    <div
        class="floor"
        :style="{
            height: floorHeignt + 'px',
        }"
    >
        <elevator-btn
            @click="$emit('call', id)"
            :class="{ active: isCalled }"
            :floor="id"
        >
        </elevator-btn>

        <div class="ceiling"></div>
        <div class="floor-material"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import elevatorBtn from "../../ui/elevatorBtn/elevatorBtn.vue";

export default defineComponent({
    name: "App",
    components: { elevatorBtn },
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
});
</script>
<style>
.floor {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    position: relative;
}
.floor-num {
    font-size: 50px;
}
.ceiling {
    width: 100%;
    height: 5px;
    background-image: url("../../assets/ceiling.jpg");
    background-size: cover;
    position: absolute;
    top: 0;
    border-radius: 10px;
}
.floor-material {
    width: 100%;
    height: 5px;
    background-image: url("../../assets/floor.jpg");
    background-size: cover;
    position: absolute;
    bottom: 0;
    border-radius: 10px;
}
.active {
    background-color: #e55f5f;
}
</style>
