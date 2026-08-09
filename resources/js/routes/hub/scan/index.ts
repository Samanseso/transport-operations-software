import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Hub\HubController::store
 * @see app/Http/Controllers/Hub/HubController.php:50
 * @route '/hub/scan'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hub/scan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\HubController::store
 * @see app/Http/Controllers/Hub/HubController.php:50
 * @route '/hub/scan'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\HubController::store
 * @see app/Http/Controllers/Hub/HubController.php:50
 * @route '/hub/scan'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Hub\HubController::store
 * @see app/Http/Controllers/Hub/HubController.php:50
 * @route '/hub/scan'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Hub\HubController::store
 * @see app/Http/Controllers/Hub/HubController.php:50
 * @route '/hub/scan'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const scan = {
    store: Object.assign(store, store),
}

export default scan