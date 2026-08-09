import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Hub\HubController::store
 * @see app/Http/Controllers/Hub/HubController.php:99
 * @route '/hub/manifests'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/hub/manifests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Hub\HubController::store
 * @see app/Http/Controllers/Hub/HubController.php:99
 * @route '/hub/manifests'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Hub\HubController::store
 * @see app/Http/Controllers/Hub/HubController.php:99
 * @route '/hub/manifests'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Hub\HubController::store
 * @see app/Http/Controllers/Hub/HubController.php:99
 * @route '/hub/manifests'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Hub\HubController::store
 * @see app/Http/Controllers/Hub/HubController.php:99
 * @route '/hub/manifests'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const manifests = {
    store: Object.assign(store, store),
}

export default manifests