import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Driver\InspectionController::index
 * @see app/Http/Controllers/Driver/InspectionController.php:17
 * @route '/driver/inspection'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/driver/inspection',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Driver\InspectionController::index
 * @see app/Http/Controllers/Driver/InspectionController.php:17
 * @route '/driver/inspection'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Driver\InspectionController::index
 * @see app/Http/Controllers/Driver/InspectionController.php:17
 * @route '/driver/inspection'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Driver\InspectionController::index
 * @see app/Http/Controllers/Driver/InspectionController.php:17
 * @route '/driver/inspection'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Driver\InspectionController::index
 * @see app/Http/Controllers/Driver/InspectionController.php:17
 * @route '/driver/inspection'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Driver\InspectionController::index
 * @see app/Http/Controllers/Driver/InspectionController.php:17
 * @route '/driver/inspection'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Driver\InspectionController::index
 * @see app/Http/Controllers/Driver/InspectionController.php:17
 * @route '/driver/inspection'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Driver\InspectionController::store
 * @see app/Http/Controllers/Driver/InspectionController.php:35
 * @route '/driver/inspection'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/driver/inspection',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Driver\InspectionController::store
 * @see app/Http/Controllers/Driver/InspectionController.php:35
 * @route '/driver/inspection'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Driver\InspectionController::store
 * @see app/Http/Controllers/Driver/InspectionController.php:35
 * @route '/driver/inspection'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Driver\InspectionController::store
 * @see app/Http/Controllers/Driver/InspectionController.php:35
 * @route '/driver/inspection'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Driver\InspectionController::store
 * @see app/Http/Controllers/Driver/InspectionController.php:35
 * @route '/driver/inspection'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const inspection = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
}

export default inspection