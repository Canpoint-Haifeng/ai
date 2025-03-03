import CpFileDownloads from './CpFileDownloads.vue'
import CpPageFilter from './Components/CpPageFilter.vue'
import LayeredLevel from './Components/LayeredLevel.vue'
import TopPagination from './Components/TopPagination.vue'
import CpSimilarDialog from './Components/CpSimilarDialog.vue'
import CpNumberInput from './Components/CpNumberInput.vue'
import CpSubjectSelect from './Components/CpSubjectSelect.vue'

// Export components
export {
  CpFileDownloads,
  CpPageFilter,
  LayeredLevel,
  TopPagination,
  CpSimilarDialog,
  CpNumberInput,
  CpSubjectSelect
}

// Default export for Vue plugin
export default {
  install(app) {
    app.component('CpFileDownloads', CpFileDownloads)
    app.component('CpPageFilter', CpPageFilter)
    app.component('LayeredLevel', LayeredLevel)
    app.component('TopPagination', TopPagination)
    app.component('CpSimilarDialog', CpSimilarDialog)
    app.component('CpNumberInput', CpNumberInput)
    app.component('CpSubjectSelect', CpSubjectSelect)
  }
}
