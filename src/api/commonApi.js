export const commonAPI = {
  // Paper builder endpoints
  PAPER_BUILDER_GET_GRADES: {
    urlPath: '/paper-builder/config/getGrades'
  },
  PAPER_BUILDER_GET_YEARS: {
    urlPath: '/paper-builder/config/getYears'
  },
  PAPER_BUILDER_GET_AREAS: {
    urlPath: '/paper-builder/config/getAreas'
  },
  PAPER_BUILDER_GET_PAPER_TYPE: {
    urlPath: '/paper-builder/config/getPaperType'
  },
  PAPER_BUILDER_GET_ALL_PAPER: {
    urlPath: '/paper-builder/paper/getAllPaper'
  },
  PAPER_BUILDER_PAPER_PREVIEW: {
    urlPath: '/paper-builder/paper/paperPreview'
  },
  PAPER_BUILDER_PAPER_COLLECT: {
    urlPath: '/paper-builder/personal/paper/collect'
  },
  PAPER_BUILDER_PAPER_UPLOAD: {
    urlPath: '/paper-builder/personal/upload'
  },
  PAPER_BUILDER_PAPER_UPLOAD_V2: {
    urlPath: '/paper-builder/v2/paper/upload'
  },
  PAPER_BUILDER_PARALLEL_GENERATE: {
    urlPath: '/paper-builder/paper-generate/v2/parallel-generate'
  },
  
  // Lesson app endpoints
  LESSON_APP_QUERY_ALL_LESSONS: {
    urlPath: '/lesson-app/index/queryAllLessons'
  },
  LESSON_APP_LESSON_COLLECT: {
    urlPath: '/lesson-app/myLesson/lesson/collect'
  },
  LESSON_APP_COPY_LESSON: {
    urlPath: '/lesson-app/lessonPreparation/copyLesson'
  },
  LESSON_APP_GET_INVOKE_INFO: {
    urlPath: '/lesson-app/config/getInvokeInfo'
  }
}
