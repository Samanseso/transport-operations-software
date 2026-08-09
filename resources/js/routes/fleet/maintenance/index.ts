import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Fleet\MaintenanceController::index
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:15
 * @route '/fleet/maintenance'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/fleet/maintenance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Fleet\MaintenanceController::index
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:15
 * @route '/fleet/maintenance'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Fleet\MaintenanceController::index
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:15
 * @route '/fleet/maintenance'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Fleet\MaintenanceController::index
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:15
 * @route '/fleet/maintenance'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Fleet\MaintenanceController::index
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:15
 * @route '/fleet/maintenance'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Fleet\MaintenanceController::index
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:15
 * @route '/fleet/maintenance'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Fleet\MaintenanceController::index
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:15
 * @route '/fleet/maintenance'
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
* @see \App\Http\Controllers\Fleet\MaintenanceController::store
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:28
 * @route '/fleet/maintenance'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/fleet/maintenance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Fleet\MaintenanceController::store
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:28
 * @route '/fleet/maintenance'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Fleet\MaintenanceController::store
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:28
 * @route '/fleet/maintenance'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Fleet\MaintenanceController::store
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:28
 * @route '/fleet/maintenance'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Fleet\MaintenanceController::store
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:28
 * @route '/fleet/maintenance'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Fleet\MaintenanceController::status
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:0
 * @route '/fleet/maintenance/{id}/status'
 */
export const status = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

status.definition = {
    methods: ["patch"],
    url: '/fleet/maintenance/{id}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Fleet\MaintenanceController::status
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:0
 * @route '/fleet/maintenance/{id}/status'
 */
status.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return status.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Fleet\MaintenanceController::status
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:0
 * @route '/fleet/maintenance/{id}/status'
 */
status.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Fleet\MaintenanceController::status
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:0
 * @route '/fleet/maintenance/{id}/status'
 */
    const statusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: status.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Fleet\MaintenanceController::status
 * @see app/Http/Controllers/Fleet/MaintenanceController.php:0
 * @route '/fleet/maintenance/{id}/status'
 */
        statusForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: status.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    status.form = statusForm
const maintenance = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
status: Object.assign(status, status),
}

export default maintenance