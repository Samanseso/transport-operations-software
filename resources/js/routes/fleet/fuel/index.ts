import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Fleet\FuelController::index
 * @see app/Http/Controllers/Fleet/FuelController.php:17
 * @route '/fleet/fuel'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/fleet/fuel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Fleet\FuelController::index
 * @see app/Http/Controllers/Fleet/FuelController.php:17
 * @route '/fleet/fuel'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Fleet\FuelController::index
 * @see app/Http/Controllers/Fleet/FuelController.php:17
 * @route '/fleet/fuel'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Fleet\FuelController::index
 * @see app/Http/Controllers/Fleet/FuelController.php:17
 * @route '/fleet/fuel'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Fleet\FuelController::index
 * @see app/Http/Controllers/Fleet/FuelController.php:17
 * @route '/fleet/fuel'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Fleet\FuelController::index
 * @see app/Http/Controllers/Fleet/FuelController.php:17
 * @route '/fleet/fuel'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Fleet\FuelController::index
 * @see app/Http/Controllers/Fleet/FuelController.php:17
 * @route '/fleet/fuel'
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
* @see \App\Http\Controllers\Fleet\FuelController::store
 * @see app/Http/Controllers/Fleet/FuelController.php:41
 * @route '/fleet/fuel'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/fleet/fuel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Fleet\FuelController::store
 * @see app/Http/Controllers/Fleet/FuelController.php:41
 * @route '/fleet/fuel'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Fleet\FuelController::store
 * @see app/Http/Controllers/Fleet/FuelController.php:41
 * @route '/fleet/fuel'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Fleet\FuelController::store
 * @see app/Http/Controllers/Fleet/FuelController.php:41
 * @route '/fleet/fuel'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Fleet\FuelController::store
 * @see app/Http/Controllers/Fleet/FuelController.php:41
 * @route '/fleet/fuel'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const fuel = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
}

export default fuel