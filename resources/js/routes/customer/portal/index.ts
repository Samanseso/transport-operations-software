import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import bulk36930f from './bulk'
/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::dashboard
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:14
 * @route '/client/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/client/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::dashboard
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:14
 * @route '/client/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::dashboard
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:14
 * @route '/client/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::dashboard
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:14
 * @route '/client/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::dashboard
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:14
 * @route '/client/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::dashboard
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:14
 * @route '/client/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::dashboard
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:14
 * @route '/client/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulk
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
export const bulk = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulk.url(options),
    method: 'get',
})

bulk.definition = {
    methods: ["get","head"],
    url: '/client/bulk-waybill',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulk
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
bulk.url = (options?: RouteQueryOptions) => {
    return bulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulk
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
bulk.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulk.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulk
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
bulk.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulk.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulk
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
    const bulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bulk.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulk
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
        bulkForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bulk.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulk
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
        bulkForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bulk.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bulk.form = bulkForm
const portal = {
    dashboard: Object.assign(dashboard, dashboard),
bulk: Object.assign(bulk, bulk36930f),
}

export default portal