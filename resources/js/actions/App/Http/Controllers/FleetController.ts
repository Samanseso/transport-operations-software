import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FleetController::index
 * @see app/Http/Controllers/FleetController.php:17
 * @route '/fleet/overview'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/fleet/overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FleetController::index
 * @see app/Http/Controllers/FleetController.php:17
 * @route '/fleet/overview'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FleetController::index
 * @see app/Http/Controllers/FleetController.php:17
 * @route '/fleet/overview'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FleetController::index
 * @see app/Http/Controllers/FleetController.php:17
 * @route '/fleet/overview'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FleetController::index
 * @see app/Http/Controllers/FleetController.php:17
 * @route '/fleet/overview'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FleetController::index
 * @see app/Http/Controllers/FleetController.php:17
 * @route '/fleet/overview'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FleetController::index
 * @see app/Http/Controllers/FleetController.php:17
 * @route '/fleet/overview'
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
* @see \App\Http\Controllers\FleetController::show
 * @see app/Http/Controllers/FleetController.php:33
 * @route '/fleet/{vehicle_id}'
 */
export const show = (args: { vehicle_id: string | number } | [vehicle_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/fleet/{vehicle_id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FleetController::show
 * @see app/Http/Controllers/FleetController.php:33
 * @route '/fleet/{vehicle_id}'
 */
show.url = (args: { vehicle_id: string | number } | [vehicle_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehicle_id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vehicle_id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehicle_id: args.vehicle_id,
                }

    return show.definition.url
            .replace('{vehicle_id}', parsedArgs.vehicle_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FleetController::show
 * @see app/Http/Controllers/FleetController.php:33
 * @route '/fleet/{vehicle_id}'
 */
show.get = (args: { vehicle_id: string | number } | [vehicle_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FleetController::show
 * @see app/Http/Controllers/FleetController.php:33
 * @route '/fleet/{vehicle_id}'
 */
show.head = (args: { vehicle_id: string | number } | [vehicle_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\FleetController::show
 * @see app/Http/Controllers/FleetController.php:33
 * @route '/fleet/{vehicle_id}'
 */
    const showForm = (args: { vehicle_id: string | number } | [vehicle_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\FleetController::show
 * @see app/Http/Controllers/FleetController.php:33
 * @route '/fleet/{vehicle_id}'
 */
        showForm.get = (args: { vehicle_id: string | number } | [vehicle_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\FleetController::show
 * @see app/Http/Controllers/FleetController.php:33
 * @route '/fleet/{vehicle_id}'
 */
        showForm.head = (args: { vehicle_id: string | number } | [vehicle_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\FleetController::store
 * @see app/Http/Controllers/FleetController.php:56
 * @route '/fleet'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/fleet',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FleetController::store
 * @see app/Http/Controllers/FleetController.php:56
 * @route '/fleet'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FleetController::store
 * @see app/Http/Controllers/FleetController.php:56
 * @route '/fleet'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\FleetController::store
 * @see app/Http/Controllers/FleetController.php:56
 * @route '/fleet'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FleetController::store
 * @see app/Http/Controllers/FleetController.php:56
 * @route '/fleet'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\FleetController::update
 * @see app/Http/Controllers/FleetController.php:102
 * @route '/fleet/{vehicle_id}'
 */
export const update = (args: { vehicle_id: string | number } | [vehicle_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/fleet/{vehicle_id}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\FleetController::update
 * @see app/Http/Controllers/FleetController.php:102
 * @route '/fleet/{vehicle_id}'
 */
update.url = (args: { vehicle_id: string | number } | [vehicle_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehicle_id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vehicle_id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehicle_id: args.vehicle_id,
                }

    return update.definition.url
            .replace('{vehicle_id}', parsedArgs.vehicle_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FleetController::update
 * @see app/Http/Controllers/FleetController.php:102
 * @route '/fleet/{vehicle_id}'
 */
update.patch = (args: { vehicle_id: string | number } | [vehicle_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\FleetController::update
 * @see app/Http/Controllers/FleetController.php:102
 * @route '/fleet/{vehicle_id}'
 */
    const updateForm = (args: { vehicle_id: string | number } | [vehicle_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\FleetController::update
 * @see app/Http/Controllers/FleetController.php:102
 * @route '/fleet/{vehicle_id}'
 */
        updateForm.patch = (args: { vehicle_id: string | number } | [vehicle_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const FleetController = { index, show, store, update }

export default FleetController