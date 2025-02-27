<template>
  <div>
    <paper-body-cell
      v-for="(item, index) in paperStructure"
      :key="index"
      :ques="item"
      :show-share-question="showShareQuestion"
      :show-layered-name="showLayeredName"
      v-on="$listeners"
    />
  </div>
</template>

<script>
  import paperBodyCell from './paper-body-cell.vue'
  export default {
    components: { paperBodyCell },
    props: {
      paperStructure: {
        type: Array,
        default: () => {
          return []
        },
      },
      showShareQuestion: {
        type: Boolean,
        default: false,
      },
      showLayeredName: {
        type: Boolean,
        default: false,
      },
    },
  }
</script>

<style lang="scss" scoped></style>
  @use "@/assets/css/variables" as *;
