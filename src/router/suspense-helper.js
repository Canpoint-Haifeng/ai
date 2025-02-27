import { h, Suspense, defineAsyncComponent } from 'vue'

/**
 * Wraps a component with Suspense and provides a loading component
 * @param {Function} componentImport - Dynamic import function for the component
 * @param {Object} loadingComponent - Component to show while loading
 * @returns {Function} - Wrapped component function
 */
export function withSuspense(componentImport, LoadingComponent) {
  const AsyncComponent = defineAsyncComponent({
    loader: componentImport,
    loadingComponent: LoadingComponent,
    delay: 200,
    timeout: 10000
  })

  return (props) => ({
    setup() {
      return () => h(Suspense, null, {
        default: () => h(AsyncComponent, props),
        fallback: () => h(LoadingComponent)
      })
    }
  })
}
