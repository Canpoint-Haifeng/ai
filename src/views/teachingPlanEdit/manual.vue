<template>
  <div style="height: 500px;">
    <!-- <teachingPlan ref="teachingPlan"/> -->
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import { mapState } from 'vuex'
import teachingPlan from './teachingPlan.vue'
export default {
  components: {
    teachingPlan,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['currSubject']),
    type() {
      return +this.$route.query.type || 1
    },
  },
  watch: {
    type() {
      this.initOutline()
    },
  },
  created() {
    this.initOutline()
  },
  methods: {
    initOutline() {
      const data = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        type: this.type,
      }
      this.newPost({ urlPath: '/lesson-app/lessonApp/initOutline' }, data, {
        showLoading: true,
      }).then(res => {
        if (res.code === 200) {
          this.$router.replace(
            `/teachingPlanEdit?id=${res.data}&type=${this.type}&manual=1`,
          )
        } else {
          this.$message.error(res.msg)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
  @use "@/assets/css/variables" as *;
