import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::store
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:29
 * @route '/client/bulk-waybill'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/client/bulk-waybill',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::store
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:29
 * @route '/client/bulk-waybill'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CustomerPortalController::store
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:29
 * @route '/client/bulk-waybill'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::store
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:29
 * @route '/client/bulk-waybill'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\CustomerPortalController::store
 * @see app/Http/Controllers/Customer/CustomerPortalController.php:29
 * @route '/client/bulk-waybill'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const bulk = {
    store: Object.assign(store, store),
}

export default bulk