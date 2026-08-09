import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulkWaybills
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
export const bulkWaybills = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkWaybills.url(options),
    method: 'get',
})

bulkWaybills.definition = {
    methods: ["get","head"],
    url: '/client/bulk-waybill',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulkWaybills
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
bulkWaybills.url = (options?: RouteQueryOptions) => {
    return bulkWaybills.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulkWaybills
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
bulkWaybills.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkWaybills.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulkWaybills
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
bulkWaybills.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulkWaybills.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulkWaybills
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
    const bulkWaybillsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bulkWaybills.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulkWaybills
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
        bulkWaybillsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bulkWaybills.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::bulkWaybills
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:24
 * @route '/client/bulk-waybill'
 */
        bulkWaybillsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bulkWaybills.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bulkWaybills.form = bulkWaybillsForm
/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::processBulkWaybills
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:29
 * @route '/client/bulk-waybill'
 */
export const processBulkWaybills = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processBulkWaybills.url(options),
    method: 'post',
})

processBulkWaybills.definition = {
    methods: ["post"],
    url: '/client/bulk-waybill',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::processBulkWaybills
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:29
 * @route '/client/bulk-waybill'
 */
processBulkWaybills.url = (options?: RouteQueryOptions) => {
    return processBulkWaybills.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::processBulkWaybills
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:29
 * @route '/client/bulk-waybill'
 */
processBulkWaybills.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processBulkWaybills.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::processBulkWaybills
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:29
 * @route '/client/bulk-waybill'
 */
    const processBulkWaybillsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: processBulkWaybills.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::processBulkWaybills
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:29
 * @route '/client/bulk-waybill'
 */
        processBulkWaybillsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: processBulkWaybills.url(options),
            method: 'post',
        })
    
    processBulkWaybills.form = processBulkWaybillsForm
const CustomerPortalController = { dashboard, bulkWaybills, processBulkWaybills }

export default CustomerPortalController