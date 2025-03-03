/**
 * Route modules index
 * This file exports all route modules for centralized management
 */

// Import route modules
import paperRoutes from './paper.routes'
import searchRoutes from './search.routes'
import smartPaperRoutes from './smartPaper.routes'
import resourceRoutes from './resource.routes'
import myResourcesRoutes from './myResources.routes'
import lessonPreparationRoutes from './lessonPreparation.routes'
import myPreparationRoutes from './myPreparation.routes'
import booksChooseRoutes from './booksChoose.routes'
import breakdownGroupRoutes from './breakdownGroup.routes'
import chapterSelectionRoutes from './chapterSelection.routes'
import paperCenterRoutes from './paperCenter.routes'
import paperUploadRoutes from './paperUpload.routes'
import intelligentLessonRoutes from './intelligentLesson.routes'
import otherRoutes from './other.routes'
import testRoutes from './test.routes'

// Export all routes
export default [
  ...paperRoutes,
  ...searchRoutes,
  ...smartPaperRoutes,
  ...resourceRoutes,
  ...myResourcesRoutes,
  ...lessonPreparationRoutes,
  ...myPreparationRoutes,
  ...booksChooseRoutes,
  ...breakdownGroupRoutes,
  ...chapterSelectionRoutes,
  ...paperCenterRoutes,
  ...paperUploadRoutes,
  ...intelligentLessonRoutes,
  ...otherRoutes,
  ...testRoutes
]
