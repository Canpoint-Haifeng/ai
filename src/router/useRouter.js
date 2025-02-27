/**
 * Router composable
 * Provides easy access to router functionality with route constants
 */

import { useRouter as vueUseRouter, useRoute as vueUseRoute } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from './constants'

/**
 * Enhanced router composable with route constants
 * @returns {Object} Router utilities with route constants
 */
export function useRouter() {
  const router = vueUseRouter()
  const route = vueUseRoute()

  /**
   * Navigate to a route using route constants
   * @param {String} routeName - Route name from ROUTE_NAMES
   * @param {Object} params - Route params
   * @param {Object} query - Route query params
   */
  const navigateTo = (routeName, params = {}, query = {}) => {
    router.push({
      name: routeName,
      params,
      query
    })
  }

  /**
   * Navigate to a route using path
   * @param {String} routePath - Route path from ROUTE_PATHS
   * @param {Object} query - Route query params
   */
  const navigateToPath = (routePath, query = {}) => {
    router.push({
      path: routePath,
      query
    })
  }

  return {
    ...router,
    route,
    navigateTo,
    navigateToPath,
    ROUTE_NAMES,
    ROUTE_PATHS
  }
}

/**
 * Enhanced route composable with route constants
 * @returns {Object} Route utilities with route constants
 */
export function useRoute() {
  const route = vueUseRoute()
  
  return {
    ...route,
    ROUTE_NAMES,
    ROUTE_PATHS
  }
}
