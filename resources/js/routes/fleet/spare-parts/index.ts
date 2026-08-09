import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Fleet\SparePartController::store
 * @see app/Http/Controllers/Fleet/SparePartController.php:12
 * @route '/fleet/spare-parts'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/fleet/spare-parts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Fleet\SparePartController::store
 * @see app/Http/Controllers/Fleet/SparePartController.php:12
 * @route '/fleet/spare-parts'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Fleet\SparePartController::store
 * @see app/Http/Controllers/Fleet/SparePartController.php:12
 * @route '/fleet/spare-parts'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Fleet\SparePartController::store
 * @see app/Http/Controllers/Fleet/SparePartController.php:12
 * @route '/fleet/spare-parts'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Fleet\SparePartController::store
 * @see app/Http/Controllers/Fleet/SparePartController.php:12
 * @route '/fleet/spare-parts'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Fleet\SparePartController::update
 * @see app/Http/Controllers/Fleet/SparePartController.php:37
 * @route '/fleet/spare-parts/{sparePart}'
 */
export const update = (args: { sparePart: number | { id: number } } | [sparePart: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/fleet/spare-parts/{sparePart}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Fleet\SparePartController::update
 * @see app/Http/Controllers/Fleet/SparePartController.php:37
 * @route '/fleet/spare-parts/{sparePart}'
 */
update.url = (args: { sparePart: number | { id: number } } | [sparePart: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sparePart: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { sparePart: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    sparePart: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sparePart: typeof args.sparePart === 'object'
                ? args.sparePart.id
                : args.sparePart,
                }

    return update.definition.url
            .replace('{sparePart}', parsedArgs.sparePart.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Fleet\SparePartController::update
 * @see app/Http/Controllers/Fleet/SparePartController.php:37
 * @route '/fleet/spare-parts/{sparePart}'
 */
update.put = (args: { sparePart: number | { id: number } } | [sparePart: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Fleet\SparePartController::update
 * @see app/Http/Controllers/Fleet/SparePartController.php:37
 * @route '/fleet/spare-parts/{sparePart}'
 */
    const updateForm = (args: { sparePart: number | { id: number } } | [sparePart: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Fleet\SparePartController::update
 * @see app/Http/Controllers/Fleet/SparePartController.php:37
 * @route '/fleet/spare-parts/{sparePart}'
 */
        updateForm.put = (args: { sparePart: number | { id: number } } | [sparePart: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Fleet\SparePartController::destroy
 * @see app/Http/Controllers/Fleet/SparePartController.php:62
 * @route '/fleet/spare-parts/{sparePart}'
 */
export const destroy = (args: { sparePart: number | { id: number } } | [sparePart: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/fleet/spare-parts/{sparePart}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Fleet\SparePartController::destroy
 * @see app/Http/Controllers/Fleet/SparePartController.php:62
 * @route '/fleet/spare-parts/{sparePart}'
 */
destroy.url = (args: { sparePart: number | { id: number } } | [sparePart: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { sparePart: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { sparePart: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    sparePart: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        sparePart: typeof args.sparePart === 'object'
                ? args.sparePart.id
                : args.sparePart,
                }

    return destroy.definition.url
            .replace('{sparePart}', parsedArgs.sparePart.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Fleet\SparePartController::destroy
 * @see app/Http/Controllers/Fleet/SparePartController.php:62
 * @route '/fleet/spare-parts/{sparePart}'
 */
destroy.delete = (args: { sparePart: number | { id: number } } | [sparePart: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Fleet\SparePartController::destroy
 * @see app/Http/Controllers/Fleet/SparePartController.php:62
 * @route '/fleet/spare-parts/{sparePart}'
 */
    const destroyForm = (args: { sparePart: number | { id: number } } | [sparePart: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Fleet\SparePartController::destroy
 * @see app/Http/Controllers/Fleet/SparePartController.php:62
 * @route '/fleet/spare-parts/{sparePart}'
 */
        destroyForm.delete = (args: { sparePart: number | { id: number } } | [sparePart: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const spareParts = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default spareParts